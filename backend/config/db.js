// Only require this file if a route needs the database. Current routes use static JSON for projects and Gmail SMTP for contact.
const mysql = require('mysql2/promise');

let pool = null;

if (process.env.DB_HOST && process.env.DB_NAME) {
  pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
}

module.exports = pool;
