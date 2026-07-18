#!/bin/sh
set -eu

# Cria e popula o banco do Gestão Oficina (shared + admin + web).
# Idempotente. Ordem: shared → admin → web.
#
# Uso local:
#   ./database/create-database.sh
#
# Variáveis:
#   PGHOST=localhost PGPORT=5432 PGUSER=postgres PGPASSWORD=postgres DB_NAME=gestao_oficina
#   CREATE_DB=true   # false no init do container (DB já existe)
#   USE_SOCKET=true  # conecta via socket Unix (init do Postgres no Docker,
#                    # quando o servidor ainda não escuta TCP)

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

PGHOST="${PGHOST:-localhost}"
PGPORT="${PGPORT:-5432}"
PGUSER="${PGUSER:-${POSTGRES_USER:-postgres}}"
export PGPASSWORD="${PGPASSWORD:-${POSTGRES_PASSWORD:-postgres}}"
DB_NAME="${DB_NAME:-${POSTGRES_DB:-gestao_oficina}}"
CREATE_DB="${CREATE_DB:-true}"
USE_SOCKET="${USE_SOCKET:-false}"

# Durante o init do container, o Postgres só aceita conexão via socket Unix.
if [ "$USE_SOCKET" = "true" ]; then
    CONN_ARGS="-U $PGUSER"
else
    CONN_ARGS="-h $PGHOST -p $PGPORT -U $PGUSER"
fi

# Schema + seed compartilhados (não inclui V000_drop_all — reset manual)
SHARED_SCRIPTS="V001_schema_domain.sql V002_schema_business.sql V003_seed_staff.sql V004_seed_mvp.sql"

# Funções específicas do admin
ADMIN_SCRIPTS="FN_USERS.sql FN_CUSTOMERS.sql FN_VEHICLES.sql FN_CATALOGS.sql FN_WORK_ORDERS.sql"

# Funções específicas do portal
WEB_SCRIPTS="FN_PORTAL.sql"

run_sql_file() {
    # shellcheck disable=SC2086
    psql -v ON_ERROR_STOP=1 $CONN_ARGS -d "$DB_NAME" -f "$1"
}

if [ "$CREATE_DB" = "true" ]; then
    echo "Ensuring database '$DB_NAME' exists..."
    # shellcheck disable=SC2086
    EXISTS="$(psql -tAc "SELECT 1 FROM pg_database WHERE datname = '$DB_NAME'" $CONN_ARGS -d postgres)"
    if [ "$EXISTS" != "1" ]; then
        # shellcheck disable=SC2086
        psql -v ON_ERROR_STOP=1 $CONN_ARGS -d postgres -c "CREATE DATABASE $DB_NAME"
    fi
fi

for f in $SHARED_SCRIPTS; do
    echo "Applying shared/$f..."
    run_sql_file "$SCRIPT_DIR/shared/$f"
done

for f in $ADMIN_SCRIPTS; do
    echo "Applying admin/$f..."
    run_sql_file "$SCRIPT_DIR/admin/$f"
done

for f in $WEB_SCRIPTS; do
    echo "Applying web/$f..."
    run_sql_file "$SCRIPT_DIR/web/$f"
done

echo "Database '$DB_NAME' ready."
