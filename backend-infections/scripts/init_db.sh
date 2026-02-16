#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SERVICE_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "Service root: $SERVICE_ROOT"
echo "Initializing database..."
docker exec -i infections-db psql -U postgres -d infections_db < "$SERVICE_ROOT/database/init.sql"

echo "Loading test data..."
docker exec -i infections-db psql -U postgres -d infections_db < "$SERVICE_ROOT/database/test_data.sql"

echo "Database ready."
