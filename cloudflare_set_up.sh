#!/usr/bin/env bash
ENV_PROD=".env.production"
CONFIG_JSON="public/config.json"

# Only update build number if .env.production exists
if [[ -f "$ENV_PROD" ]]; then
    mkdir -p public

    BUILD_ID=$(date +%s)

    echo "{\"BUILD_ID\": \"$BUILD_ID\"}" > "$CONFIG_JSON"
fi

COMMANDS="${1:-}"

# Run commands if provided
if [[ -n "$COMMANDS" ]]; then
  echo "🚀 Running commands: $COMMANDS"
  bash -c "$COMMANDS"
else
  echo "ℹ️ No commands provided."
fi
