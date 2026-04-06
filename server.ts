import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import multer from 'multer';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from './src/backend/db.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const JWT_SECRET = process.env.JWT_SECRET || 'college-complaint-secret-key';
const PORT = 3000;

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});
const upload = multer({ storage });

async function startServer() {
  const app = express();
  app.use(express.json());
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

  // --- API ROUTES ---

  // Auth Middleware
  const authenticateToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (err) return res.status(403).json({ error: 'Forbidden' });
      req.user = user;
      next();
    });
  };

  const isAdmin = (req: any, res: any, next: any) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });
    next();
  };

  // Auth Routes
    app.post('/api/auth/register', async (req, res) => {
      const { name, email, password, role, department, semester, roll_number } = req.body;
      
      if (!name || !email || !password) {
        return res.status(400).json({ error: 'Name, email and password are required' });
      }

      if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters' });
      }

      try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const stmt = db.prepare('INSERT INTO users (name, email, password, role, department, semester, roll_number) VALUES (?, ?, ?, ?, ?, ?, ?)');
        const info = stmt.run(name, email, hashedPassword, role || 'student', department, semester, roll_number);
        res.status(201).json({ id: info.lastInsertRowid, message: 'User registered successfully' });
      } catch (error: any) {
        if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
          return res.status(400).json({ error: 'Email or Roll Number already exists' });
        }
        res.status(500).json({ error: 'Registration failed' });
      }
    });
  
    app.post('/api/auth/login', async (req, res) => {
      const { email, password } = req.body;
      const user: any = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
  
      const token = jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '24h' });
      res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role, department: user.department, semester: user.semester, roll_number: user.roll_number, profile_photo: user.profile_photo, created_at: user.created_at } });
    });
  
    app.get('/api/auth/me', authenticateToken, (req: any, res) => {
      const user: any = db.prepare('SELECT id, name, email, role, department, semester, roll_number, profile_photo, created_at FROM users WHERE id = ?').get(req.user.id);
      res.json(user);
    });

    app.patch('/api/auth/profile', authenticateToken, (req: any, res) => {
      const { name, department, semester, roll_number } = req.body;
      try {
        const stmt = db.prepare('UPDATE users SET name = ?, department = ?, semester = ?, roll_number = ? WHERE id = ?');
        stmt.run(name, department, semester, roll_number, req.user.id);
        res.json({ message: 'Profile updated successfully' });
      } catch (error: any) {
        if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
          return res.status(400).json({ error: 'Roll Number already exists' });
        }
        res.status(500).json({ error: 'Failed to update profile' });
      }
    });

    app.post('/api/auth/profile/photo', authenticateToken, upload.single('photo'), (req: any, res) => {
      if (!req.file) return res.status(400).json({ error: 'No photo uploaded' });
      const photoPath = `/uploads/${req.file.filename}`;
      try {
        const stmt = db.prepare('UPDATE users SET profile_photo = ? WHERE id = ?');
        stmt.run(photoPath, req.user.id);
        res.json({ photoPath, message: 'Profile photo updated successfully' });
      } catch (error) {
        res.status(500).json({ error: 'Failed to update profile photo' });
      }
    });
  
    // Complaint Routes
    app.post('/api/complaints', authenticateToken, upload.single('file'), (req: any, res) => {
      const { title, description, category } = req.body;
      const filePath = req.file ? `/uploads/${req.file.filename}` : null;
  
      try {
        const stmt = db.prepare('INSERT INTO complaints (user_id, title, description, category, file_path) VALUES (?, ?, ?, ?, ?)');
        const info = stmt.run(req.user.id, title, description, category, filePath);
        res.status(201).json({ id: info.lastInsertRowid, message: 'Grievance submitted successfully' });
      } catch (error) {
        res.status(500).json({ error: 'Failed to submit grievance' });
      }
    });
  
    app.get('/api/complaints', authenticateToken, (req: any, res) => {
      let complaints;
      if (req.user.role === 'admin') {
        complaints = db.prepare(`
          SELECT c.*, u.name as student_name, u.department, u.semester, u.roll_number 
          FROM complaints c 
          JOIN users u ON c.user_id = u.id 
          ORDER BY c.created_at DESC
        `).all();
      } else {
        complaints = db.prepare('SELECT * FROM complaints WHERE user_id = ? ORDER BY created_at DESC').all(req.user.id);
      }
      res.json(complaints);
    });

  app.get('/api/complaints/stats', authenticateToken, isAdmin, (req, res) => {
    const stats = db.prepare('SELECT category, count(*) as count FROM complaints GROUP BY category').all();
    const statusStats = db.prepare('SELECT status, count(*) as count FROM complaints GROUP BY status').all();
    res.json({ categoryStats: stats, statusStats });
  });

  app.patch('/api/complaints/:id/status', authenticateToken, isAdmin, (req, res) => {
    const { status, remarks } = req.body;
    const { id } = req.params;

    try {
      const stmt = db.prepare('UPDATE complaints SET status = ?, admin_remarks = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?');
      stmt.run(status, remarks, id);
      res.json({ message: 'Status updated successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update status' });
    }
  });

    app.delete('/api/complaints/:id', authenticateToken, (req: any, res) => {
    const { id } = req.params;
    const complaint: any = db.prepare('SELECT * FROM complaints WHERE id = ?').get(id);

    if (!complaint) return res.status(404).json({ error: 'Grievance not found' });

    // Students can only delete their own pending complaints
    if (req.user.role === 'student') {
      if (complaint.user_id !== req.user.id) return res.status(403).json({ error: 'Unauthorized' });
      if (complaint.status !== 'Pending') return res.status(400).json({ error: 'Cannot delete processed grievances' });
    }

    try {
      db.prepare('DELETE FROM complaints WHERE id = ?').run(id);
      res.json({ message: 'Grievance deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete grievance' });
    }
  });

  // --- VITE MIDDLEWARE ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
