#!/bin/sh

set -e

echo "Waiting for database..."

while ! nc -z $SQL_HOST $SQL_PORT; do
  sleep 1
done

echo "Database is ready! Starting server..."
exec "$@"
