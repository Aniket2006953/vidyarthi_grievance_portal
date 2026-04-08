import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database('college_complaints.db');

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT CHECK(role IN ('student', 'admin')) NOT NULL,
    department TEXT,
    semester TEXT,
    roll_number TEXT UNIQUE,
    profile_photo TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Add profile_photo column if it doesn't exist (for existing databases)
  -- SQLite doesn't support ADD COLUMN IF NOT EXISTS
`);

try {
  db.exec('ALTER TABLE users ADD COLUMN profile_photo TEXT');
} catch (e) {}

try {
  db.exec('ALTER TABLE users ADD COLUMN created_at DATETIME DEFAULT CURRENT_TIMESTAMP');
} catch (e) {}

db.exec(`
  CREATE TABLE IF NOT EXISTS complaints (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT CHECK(category IN ('Academic', 'Hostel', 'Mess', 'Technical', 'Scholarship', 'Library', 'Ragging', 'Infrastructure', 'Other')) NOT NULL,
    status TEXT CHECK(status IN ('Pending', 'In Progress', 'Resolved', 'Rejected')) DEFAULT 'Pending',
    file_path TEXT,
    admin_remarks TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
`);

export default db;
