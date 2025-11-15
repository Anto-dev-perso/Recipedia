#!/bin/bash

set -e

INPUT_DIR="${1:-maestro-logs}"
OUTPUT_FILE="${2:-maestro-logs-all-suites.zip}"

echo "🔄 Merging Maestro logs..."
echo "   Input directory: $INPUT_DIR"
echo "   Output file: $OUTPUT_FILE"

# Create temporary directory for extraction
TEMP_DIR=$(mktemp -d)
trap "rm -rf $TEMP_DIR" EXIT

# Extract all zip files
ZIP_COUNT=0
for zip_file in "$INPUT_DIR"/*/*.zip; do
  if [ -f "$zip_file" ]; then
    echo "   Extracting $(basename "$zip_file")..."
    unzip -qo "$zip_file" -d "$TEMP_DIR"
    ZIP_COUNT=$((ZIP_COUNT + 1))
  fi
done

if [ $ZIP_COUNT -eq 0 ]; then
  echo "⚠️  No zip files found to merge"
  exit 1
fi

# Create merged archive
cd "$TEMP_DIR"
zip -r - . > "$OLDPWD/$OUTPUT_FILE"
cd "$OLDPWD"

FILE_SIZE=$(du -h "$OUTPUT_FILE" | cut -f1)
echo "✅ Merged $ZIP_COUNT Maestro log archives"
echo "   Output size: $FILE_SIZE"
