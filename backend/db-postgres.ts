// Database setup for Render (PostgreSQL)
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Initialize tables
const createTablesQuery = `
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT CHECK(role IN ('student', 'admin')) NOT NULL DEFAULT 'student',
    department TEXT,
    semester TEXT,
    roll_number TEXT UNIQUE,
    profile_photo TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS complaints (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT CHECK(category IN ('Academic', 'Hostel', 'Mess', 'Technical', 'Scholarship', 'Library', 'Ragging', 'Infrastructure', 'Other')) NOT NULL,
    status TEXT CHECK(status IN ('Pending', 'In Progress', 'Resolved', 'Rejected')) DEFAULT 'Pending',
    file_path TEXT,
    admin_remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`;

async function initializeDatabase() {
  try {
    await pool.query(createTablesQuery);
    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Database initialization error:', error);
  }
}

initializeDatabase();

export default pool;
