import { z } from "zod";

export const ERROR_STATUSES = ["new", "investigating", "resolved", "muted"] as const;
export type ErrorStatus = typeof ERROR_STATUSES[number];

/**
 * Statuses shown on the board by default. `muted` is deliberately excluded:
 * muting is the "I know, stop telling me" escape hatch, so a muted error
 * must never surface in Total/New/... counts or lists — only under its own
 * filter.
 */
export const BOARD_STATUSES = ["new", "investigating", "resolved"] as const;

const MAX_MESSAGE_LENGTH = 2000;
const MAX_STACK_LENGTH = 8000;
const MAX_PARAMS_LENGTH = 4000;
const PAGE_SIZE = 50;
const MAX_IDS_PER_ACTION = 200;

export interface ErrorRow {
    id: number;
    fingerprint: string;
    created_at: number;
    updated_at: number;
    flavour: string;
    caller: string;
    message: string;
    stack: string | null;
    params: string | null;
    is_client: number;
    status: ErrorStatus;
    count: number;
    user_email: string | null;
    /** Times this error came back AFTER being marked resolved. */
    reopen_count: number;
    /** When it was last marked resolved, so "came back after N days" reads. */
    resolved_at: number | null;
}

function truncate(value: string, maxLength: number): string {
    return value.length > maxLength ? value.slice(0, maxLength) : value;
}

async function sha256Hex(input: string): Promise<string> {
    const data = new TextEncoder().encode(input);
    const digest = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(digest))
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join("");
}

export async function computeFingerprint(flavour: string, caller: string, message: string): Promise<string> {
    return sha256Hex(`${flavour}|${caller}|${message}`);
}

export interface RecordErrorInput {
    flavour: string;
    caller: string;
    message: string;
    stack: string | null;
    params: string | null;
    isClient: boolean;
    userEmail: string | null;
}

const CREATE_TABLE_SQL = `
    CREATE TABLE IF NOT EXISTS errors (
        id          INTEGER PRIMARY KEY AUTOINCREMENT,
        fingerprint TEXT    NOT NULL UNIQUE,
        created_at  INTEGER NOT NULL,
        updated_at  INTEGER NOT NULL,
        flavour     TEXT    NOT NULL,
        caller      TEXT    NOT NULL,
        message     TEXT    NOT NULL,
        stack       TEXT,
        params      TEXT,
        is_client   INTEGER NOT NULL DEFAULT 0,
        status      TEXT    NOT NULL DEFAULT 'new',
        count       INTEGER NOT NULL DEFAULT 1,
        user_email  TEXT,
        reopen_count INTEGER NOT NULL DEFAULT 0,
        resolved_at  INTEGER
    )
`;

// Columns added after the table already shipped. SQLite has no
// "ADD COLUMN IF NOT EXISTS", so each of these always errors on a DB that
// already has the column — ensureSchema swallows exactly that error and
// rethrows anything else. Append-only: never remove an entry, or databases
// created before it existed stop getting the column.
const ADD_COLUMN_SQL = [
    "ALTER TABLE errors ADD COLUMN user_email TEXT",
    "ALTER TABLE errors ADD COLUMN reopen_count INTEGER NOT NULL DEFAULT 0",
    "ALTER TABLE errors ADD COLUMN resolved_at INTEGER",
];

const CREATE_INDEXES_SQL = [
    "CREATE INDEX IF NOT EXISTS idx_errors_updated_at ON errors (updated_at DESC)",
    "CREATE INDEX IF NOT EXISTS idx_errors_flavour ON errors (flavour)",
    "CREATE INDEX IF NOT EXISTS idx_errors_status ON errors (status)",
];

class ErrorsRepository {
    // Per-isolate memo — avoids re-running the DDL on every call within the
    // same Worker instance. A cold isolate simply re-runs it once, which is
    // harmless since every statement is idempotent (IF NOT EXISTS).
    private schemaReady: Promise<void> | null = null;

    private ensureSchema(db: D1Database): Promise<void> {
        if (!this.schemaReady) {
            this.schemaReady = (async () => {
                await db
                    .batch([
                        db.prepare(CREATE_TABLE_SQL),
                        ...CREATE_INDEXES_SQL.map((sql) => db.prepare(sql)),
                    ]);
                for (const sql of ADD_COLUMN_SQL) {
                    try {
                        await db.prepare(sql).run();
                    } catch (error) {
                        if (!String(error).includes("duplicate column name")) throw error;
                    }
                }
            })().catch((error) => {
                this.schemaReady = null;
                throw error;
            });
        }
        return this.schemaReady;
    }

    async record(db: D1Database, input: RecordErrorInput): Promise<void> {
        await this.ensureSchema(db);
        const message = truncate(input.message, MAX_MESSAGE_LENGTH);
        const stack = input.stack ? truncate(input.stack, MAX_STACK_LENGTH) : null;
        const params = input.params ? truncate(input.params, MAX_PARAMS_LENGTH) : null;
        const fingerprint = await computeFingerprint(input.flavour, input.caller, message);
        const now = Date.now();

        // Two rules on repeat, both driven entirely by the current status:
        //   muted    -> stays muted forever. Still counted (so you can see
        //               how noisy it is) but never resurfaces on the board.
        //   resolved -> reopens as 'new' and bumps reopen_count, so a
        //               regression is visibly distinct from a fresh error.
        // Anything else keeps its status untouched.
        await db
            .prepare(
                `INSERT INTO errors (fingerprint, created_at, updated_at, flavour, caller, message, stack, params, is_client, user_email)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                 ON CONFLICT (fingerprint) DO UPDATE SET
                   updated_at   = excluded.updated_at,
                   count        = count + 1,
                   stack        = excluded.stack,
                   params       = excluded.params,
                   user_email   = excluded.user_email,
                   reopen_count = CASE WHEN status = 'resolved' THEN reopen_count + 1 ELSE reopen_count END,
                   status       = CASE WHEN status = 'resolved' THEN 'new' ELSE status END`,
            )
            .bind(fingerprint, now, now, input.flavour, input.caller, message, stack, params, input.isClient ? 1 : 0, input.userEmail)
            .run();
    }

    /** Fetches PAGE_SIZE + 1 rows so `paginate` can tell whether more exist. */
    private buildListQuery(filters: {
        flavour: string;
        status: string;
        q: string;
        cursor: number | null;
    }): { sql: string; bindings: unknown[] } {
        const conditions: string[] = [];
        const bindings: unknown[] = [];

        if (filters.flavour !== "all") {
            conditions.push("flavour = ?");
            bindings.push(filters.flavour);
        }
        if (filters.status === "all") {
            // "All" means all BOARD statuses — muted errors are opt-in only.
            conditions.push("status != 'muted'");
        } else {
            conditions.push("status = ?");
            bindings.push(filters.status);
        }
        if (filters.q) {
            conditions.push("(message LIKE ? OR caller LIKE ? OR user_email LIKE ?)");
            const like = `%${filters.q}%`;
            bindings.push(like, like, like);
        }
        if (filters.cursor !== null) {
            conditions.push("updated_at < ?");
            bindings.push(filters.cursor);
        }

        const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
        bindings.push(PAGE_SIZE + 1);

        return {
            sql: `SELECT * FROM errors ${where} ORDER BY updated_at DESC, id DESC LIMIT ?`,
            bindings,
        };
    }

    private paginate(rows: ErrorRow[]): { rows: ErrorRow[]; nextCursor: number | null } {
        const hasMore = rows.length > PAGE_SIZE;
        const page = hasMore ? rows.slice(0, PAGE_SIZE) : rows;
        return { rows: page, nextCursor: hasMore ? page[page.length - 1].updated_at : null };
    }

    async list(
        db: D1Database,
        filters: { flavour: string; status: string; q: string; cursor: number | null },
    ): Promise<{ rows: ErrorRow[]; nextCursor: number | null }> {
        await this.ensureSchema(db);
        const { sql, bindings } = this.buildListQuery(filters);
        const result = await db.prepare(sql).bind(...bindings).all<ErrorRow>();
        return this.paginate(result.results ?? []);
    }

    async getById(db: D1Database, id: number): Promise<ErrorRow | null> {
        await this.ensureSchema(db);
        const row = await db.prepare("SELECT * FROM errors WHERE id = ?").bind(id).first<ErrorRow>();
        return row ?? null;
    }

    async distinctFlavours(db: D1Database): Promise<string[]> {
        await this.ensureSchema(db);
        const result = await db.prepare("SELECT DISTINCT flavour FROM errors ORDER BY flavour").all<{ flavour: string }>();
        return (result.results ?? []).map((row) => row.flavour);
    }

    /**
     * Everything the board needs, in ONE D1 round-trip via `db.batch` —
     * the list page previously issued three separate queries (list, flavours,
     * counts) and paid three network hops for them.
     */
    async loadBoard(
        db: D1Database,
        filters: { flavour: string; status: string; q: string; cursor: number | null },
    ): Promise<{
        rows: ErrorRow[];
        nextCursor: number | null;
        flavours: string[];
        counts: Record<ErrorStatus, number>;
    }> {
        await this.ensureSchema(db);

        const listQuery = this.buildListQuery(filters);
        const [listResult, flavourResult, countResult] = await db.batch([
            db.prepare(listQuery.sql).bind(...listQuery.bindings),
            db.prepare("SELECT DISTINCT flavour FROM errors ORDER BY flavour"),
            db.prepare("SELECT status, COUNT(*) as count FROM errors GROUP BY status"),
        ]);

        const counts: Record<ErrorStatus, number> = { new: 0, investigating: 0, resolved: 0, muted: 0 };
        for (const row of (countResult.results ?? []) as { status: ErrorStatus; count: number }[]) {
            counts[row.status] = row.count;
        }

        return {
            ...this.paginate((listResult.results ?? []) as ErrorRow[]),
            flavours: ((flavourResult.results ?? []) as { flavour: string }[]).map((row) => row.flavour),
            counts,
        };
    }

    async countByStatus(db: D1Database): Promise<Record<ErrorStatus, number>> {
        await this.ensureSchema(db);
        const result = await db
            .prepare("SELECT status, COUNT(*) as count FROM errors GROUP BY status")
            .all<{ status: ErrorStatus; count: number }>();
        const counts: Record<ErrorStatus, number> = { new: 0, investigating: 0, resolved: 0, muted: 0 };
        for (const row of result.results ?? []) {
            counts[row.status] = row.count;
        }
        return counts;
    }

    async setStatus(db: D1Database, ids: number[], status: ErrorStatus): Promise<void> {
        await this.ensureSchema(db);
        const boundedIds = ids.slice(0, MAX_IDS_PER_ACTION);
        if (boundedIds.length === 0) return;
        const placeholders = boundedIds.map(() => "?").join(", ");
        // Stamp resolved_at when resolving and clear it otherwise, so the
        // detail view can say "resolved X ago, came back Y times".
        await db
            .prepare(
                `UPDATE errors
                    SET status      = ?,
                        resolved_at = CASE WHEN ? = 'resolved' THEN ? ELSE NULL END
                  WHERE id IN (${placeholders})`,
            )
            .bind(status, status, Date.now(), ...boundedIds)
            .run();
    }

    async deleteByIds(db: D1Database, ids: number[]): Promise<void> {
        await this.ensureSchema(db);
        const boundedIds = ids.slice(0, MAX_IDS_PER_ACTION);
        if (boundedIds.length === 0) return;
        const placeholders = boundedIds.map(() => "?").join(", ");
        await db.prepare(`DELETE FROM errors WHERE id IN (${placeholders})`).bind(...boundedIds).run();
    }

    async deleteAllResolved(db: D1Database): Promise<void> {
        await this.ensureSchema(db);
        await db.prepare("DELETE FROM errors WHERE status = 'resolved'").run();
    }
}

const errorsRepository = new ErrorsRepository();

export default errorsRepository;

export const errorStatusSchema = z.enum(ERROR_STATUSES);

export const errorIdsSchema = z.array(z.number().int().positive()).min(1).max(MAX_IDS_PER_ACTION);

export const errorsListParamsSchema = z.object({
    flavour: z.string().default("all"),
    status: z.union([errorStatusSchema, z.literal("all")]).default("all"),
    q: z.string().max(200).default(""),
    cursor: z.coerce.number().int().nonnegative().nullable().default(null),
});
