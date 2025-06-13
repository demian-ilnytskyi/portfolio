#!/bin/bash

echo "🔍 Running the 'check-size' script from package.json..."
OUTPUT=$(npm run check-size 2>&1)

echo "📄 Capturing output from 'check-size'..."
echo "$OUTPUT"

# Extract the gzipped size in KiB
GZIP_SIZE_KIB=$(echo "$OUTPUT" | grep "Total Upload:" | grep "gzip:" | awk '{print $7}')

# Ensure extraction was successful
if [[ -z "$GZIP_SIZE_KIB" ]]; then
  echo "⚠️  Failed to extract gzipped size. Please check the script output format."
  exit 1
fi

echo "📊 Gzipped size extracted: ${GZIP_SIZE_KIB} KiB"

# Convert KiB to MB (approximation)
GZIP_SIZE_MB=$(echo "scale=2; $GZIP_SIZE_KIB / 1024" | bc)
echo "📏 Converted gzipped size: ${GZIP_SIZE_MB} MB"

# Ensure MAX_SIZE_MB is set (default to 3MB)
MAX_SIZE_MB=${MAX_SIZE_MB:-3}
echo "🔎 Max allowed gzipped size: ${MAX_SIZE_MB} MB"

# Compare gzipped size with max allowed size
if (( $(echo "$GZIP_SIZE_MB > $MAX_SIZE_MB" | bc -l) )); then
  echo "🚨❌ Gzipped build size exceeds ${MAX_SIZE_MB}MB limit!"
  echo "🛑 Deployment aborted to prevent oversized uploads."
  exit 1
else
  echo "✅ Gzipped build size is within the limit: ${GZIP_SIZE_MB}MB."
  echo "🚀 Proceeding with deployment..."
fi
