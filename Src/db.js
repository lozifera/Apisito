const { Pool } = require('pg');

 const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'VapeShop',
    password: 'loza',
    port: 5432,
});

module.exports = pool;