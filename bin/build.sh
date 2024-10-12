#!/bin/bash
set -euxo pipefail
bun install
bun run build.ts
