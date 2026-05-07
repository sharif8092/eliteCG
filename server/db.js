import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, '..', 'cart.db');
let db;

try {
    console.log(`[DB] Attempting to connect to SQLite at: ${dbPath}`);
    db = new Database(dbPath, { verbose: console.log });
    console.log('[DB] Connected successfully');

    // Initialize tables
    db.exec(`
        CREATE TABLE IF NOT EXISTS carts (
            id TEXT PRIMARY KEY,
            user_id TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS cart_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            cart_id TEXT,
            product_id TEXT NOT NULL,
            quantity INTEGER NOT NULL,
            branding TEXT,
            is_sample BOOLEAN DEFAULT 0,
            price REAL,
            metadata TEXT,
            added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE CASCADE
        );

        CREATE INDEX IF NOT EXISTS idx_cart_user ON carts(user_id);
        CREATE INDEX IF NOT EXISTS idx_items_cart ON cart_items(cart_id);
    `);
    console.log('[DB] Tables initialized successfully');
} catch (error) {
    console.error('[DB] Initialization Error:', error.message, error.stack);
}

export default db;

