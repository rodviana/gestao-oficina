#!/bin/sh
set -eu

# Inicialização do Postgres no Docker (roda uma vez, no primeiro boot do volume).
# O database já foi criado pelo entrypoint via POSTGRES_DB, então só aplicamos os
# scripts — a lógica de ordem/aplicação fica no create-database.sh (fonte única).
# Nesta fase o Postgres só escuta no socket Unix (TCP ainda desligado), por isso
# USE_SOCKET=true. database/ é montado em /sql (ver docker-compose.yml).
CREATE_DB=false USE_SOCKET=true sh /sql/create-database.sh
