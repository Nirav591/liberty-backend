const mysql = require('mysql');

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "sinsim_liberty",
});

pool.getConnection((err, connection) => {
  if (err) {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.error('Database connection was closed.');
    }
    if (err.code === 'ER_CON_COUNT_ERROR') {
      console.error('Database has too many connections.');
    }
    if (err.code === 'ECONNREFUSED') {
      console.error('Database connection was refused.');
    }
  } else {
    console.log('Database connection established.');
    connection.release();
  }
});

exports.pool = pool;