const Pool = require('pg').Pool;

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'planner',
    password: 'reading1003',
    port: 5432,
});

module.exports = pool;