#!/bin/sh
set -e

/env.sh "MELI_" "/www"

echo "Launching nginx... (no logs before the first request or error)"
exec "$@"
