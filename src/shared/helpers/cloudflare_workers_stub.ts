// Client-side stub for cloudflare:workers when referenced in shared code
export const env = (typeof process !== "undefined" ? process.env : {}) as unknown as CloudflareEnv;
const cloudflareWorkersStub = { env };
export default cloudflareWorkersStub;
