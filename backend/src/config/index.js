
import mysql from 'mysql2';

// const con = mysql.createConnection({
//   host: process.env.DB_HOST || 'localhost', 
//   user: process.env.DB_USER || 'alphauser',
//   password: process.env.DB_PASSWORD || '@_!;@hqhij;C7T)E',
//   database: process.env.DB_NAME || 'alphaodinnew_alphadatabase',
//   port: process.env.DB_PORT || 3306,
//   connectTimeout: 10000
// });

const con = mysql.createConnection({
  host:  'localhost', 
  user:  'root',
  password:  'root',
  database: 'local',
  port:  10017,
  connectTimeout: 10000
});

con.connect(err => {
  if (err) {
    console.error('Error connecting to the database:', err);
    process.exit(1); 
  } else {
    console.log('Connected to the database');
  }
});

export default con; 