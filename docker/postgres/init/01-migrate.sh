#!/bin/sh
set -eu

SQL_DIR="/sql"

for f in \
  V001_schema_users.sql \
  P_FIND_USER_BY_EMAIL.sql \
  P_CREATE_USER.sql \
  P_COUNT_USERS_FILTERED.sql \
  P_FIND_USERS_FILTERED.sql \
  V002_seed_admin.sql
do
  echo "Applying $f..."
  psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" -f "$SQL_DIR/$f"
done
