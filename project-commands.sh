#!/bin/bash

# Project commands helper script for my-v0-project

# Install dependencies
install() {
  echo "Installing dependencies with pnpm..."
  pnpm install
}

# Run development server
dev() {
  echo "Starting development server..."
  pnpm dev
}

# Build the project
build() {
  echo "Building the project..."
  pnpm build
}

# Start the production server
start() {
  echo "Starting the production server..."
  pnpm start
}

# Run linter
lint() {
  echo "Running linter..."
  pnpm lint
}

# Database setup - customize the DB client command below
db_setup() {
  echo "Running database setup scripts..."

  # Example using psql (PostgreSQL)
  # Uncomment and set your database connection details
  # PGPASSWORD=yourpassword psql -h yourhost -U youruser -d yourdb -f scripts/001-create-tables.sql
  # PGPASSWORD=yourpassword psql -h yourhost -U youruser -d yourdb -f scripts/002-seed-data.sql

  # Example using mysql
  # mysql -h yourhost -u youruser -p yourdb < scripts/001-create-tables.sql
  # mysql -h yourhost -u youruser -p yourdb < scripts/002-seed-data.sql

  echo "Please customize the db_setup function with your database client commands."
}

# Show usage
usage() {
  echo "Usage: $0 {install|dev|build|start|lint|db_setup}"
  exit 1
}

# Main
if [ $# -eq 0 ]; then
  usage
fi

case "$1" in
  install)
    install
    ;;
  dev)
    dev
    ;;
  build)
    build
    ;;
  start)
    start
    ;;
  lint)
    lint
    ;;
  db_setup)
    db_setup
    ;;
  *)
    usage
    ;;
esac
