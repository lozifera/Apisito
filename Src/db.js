const { Pool } = require('pg');

const pool = new Pool({
    host: process.env.POSTGRES_HOST || 'localhost',
    user: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || 'loza',
    database: process.env.POSTGRES_DATABASE || 'vape_shop',
    port: process.env.POSTGRES_PORT || 5432,
});

module.exports = pool;