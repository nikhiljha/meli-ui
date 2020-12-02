#!/bin/bash
set -e

/env.js

echo "Launching nginx... (no logs before the first request or error)"
exec "$@"
