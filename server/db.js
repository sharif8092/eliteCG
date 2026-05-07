import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

let pool;

try {
  pool = mysql.createPool(dbConfig);
  console.log(`[DB] Attempting to connect to MySQL at ${dbConfig.host} as ${dbConfig.user}`);
  
  // Test connection
  const connection = await pool.getConnection();
  console.log('[DB] Connected successfully to MySQL');
  
  // Initialize tables
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS carts (
      id VARCHAR(255) PRIMARY KEY,
      user_id VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  await connection.execute(`
    CREATE TABLE IF NOT EXISTS cart_items (
      id INT AUTO_INCREMENT PRIMARY KEY,
      cart_id VARCHAR(255),
      product_id VARCHAR(255) NOT NULL,
      quantity INT NOT NULL,
      branding TEXT,
      is_sample BOOLEAN DEFAULT 0,
      price DECIMAL(10, 2),
      metadata TEXT,
      added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE CASCADE
    )
  `);

  console.log('[DB] Tables verified/initialized');
  connection.release();
} catch (error) {
  console.error('[DB] Connection/Initialization Error:', error.message);
}

// Wrapper to match better-sqlite3 API if needed, or just export pool
// Since better-sqlite3 uses sync calls, this might require refactoring in server.js
export default pool;
