#!/bin/sh
set -eu

# POSIX sh script that does NOT require jq.
# Auto-discovers latest broadcast run-latest.json unless a path is provided.

BASE="/workspace/cohort-1-assignments-public/1a/broadcast/MiniAMM.s.sol"
FILE_PATH="${1:-}"

if [ -z "$FILE_PATH" ]; then
  # Pick most recently modified run-latest.json under broadcast dir
  FILE_PATH=$(ls -1t "$BASE"/*/run-latest.json 2>/dev/null | head -n 1 || true)
fi

if [ -z "$FILE_PATH" ] || [ ! -f "$FILE_PATH" ]; then
  echo "{\n  \"mock_erc_0\": \"\",\n  \"mock_erc_1\": \"\",\n  \"mini_amm\": \"\"\n}"
  exit 0
fi

# Parse addresses using awk (busybox-compatible)
awk '
  /"contractName"/ {
    if ($0 ~ /"MockERC20"/) last="M";
    else if ($0 ~ /"MiniAMM"/) last="A";
    else last="";
  }
  /"contractAddress"/ {
    line=$0;
    # strip up to the first quote after the key
    sub(/.*"contractAddress"[[:space:]]*:[[:space:]]*"/, "", line);
    # strip everything after the closing quote
    sub(/".*/, "", line);
    # busybox awk may not support {40}; use length + prefix check instead
    if (substr(line,1,2) == "0x" && length(line) == 42) {
      addr=line;
      if (last=="M") {
        if (m0=="") m0=addr;
        else if (m1=="") m1=addr;
      } else if (last=="A") {
        if (a=="") a=addr;
      }
    }
  }
  END {
    printf("{\n    \"mock_erc_0\": \"%s\",\n    \"mock_erc_1\": \"%s\",\n    \"mini_amm\": \"%s\"\n}\n", m0, m1, a);
  }
' "$FILE_PATH"