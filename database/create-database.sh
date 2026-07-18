#!/bin/sh
set -eu

# Cria e popula o banco do Gestão Oficina (admin + web) a partir dos scripts SQL
# em database/admin e database/web, na ordem correta. Idempotente.
#
# Uso local (Postgres rodando):
#   ./database/create-database.sh
#
# Variáveis (com defaults):
#   PGHOST=localhost PGPORT=5432 PGUSER=postgres PGPASSWORD=postgres DB_NAME=gestao_oficina
#   CREATE_DB=true   # cria o database se não existir; use false quando ele já existe
#                    # (ex.: dentro do init do container, onde o Postgres já criou o DB)

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

PGHOST="${PGHOST:-localhost}"
PGPORT="${PGPORT:-5432}"
PGUSER="${PGUSER:-${POSTGRES_USER:-postgres}}"
export PGPASSWORD="${PGPASSWORD:-${POSTGRES_PASSWORD:-postgres}}"
DB_NAME="${DB_NAME:-${POSTGRES_DB:-gestao_oficina}}"
CREATE_DB="${CREATE_DB:-true}"

# Scripts de cada aplicação, na ordem de aplicação.
ADMIN_SCRIPTS="V001_schema_users.sql P_FIND_USER_BY_EMAIL.sql P_CREATE_USER.sql P_COUNT_USERS_FILTERED.sql P_FIND_USERS_FILTERED.sql V002_seed_admin.sql"
WEB_SCRIPTS="V001_schema_customers.sql P_FIND_CUSTOMER_BY_LOGIN.sql V002_seed_customers.sql"

run_sql_file() {
    psql -v ON_ERROR_STOP=1 -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" -d "$DB_NAME" -f "$1"
}

if [ "$CREATE_DB" = "true" ]; then
    echo "Ensuring database '$DB_NAME' exists..."
    EXISTS="$(psql -tAc "SELECT 1 FROM pg_database WHERE datname = '$DB_NAME'" \
        -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" -d postgres)"
    if [ "$EXISTS" != "1" ]; then
        psql -v ON_ERROR_STOP=1 -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" -d postgres \
            -c "CREATE DATABASE $DB_NAME"
    fi
fi

for f in $ADMIN_SCRIPTS; do
    echo "Applying admin/$f..."
    run_sql_file "$SCRIPT_DIR/admin/$f"
done

for f in $WEB_SCRIPTS; do
    echo "Applying web/$f..."
    run_sql_file "$SCRIPT_DIR/web/$f"
done

echo "Database '$DB_NAME' ready."
