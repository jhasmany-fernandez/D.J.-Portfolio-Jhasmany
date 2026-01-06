-- Crear base de datos si no existe
SELECT 'CREATE DATABASE portfolio_db'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'portfolio_db')\gexec
