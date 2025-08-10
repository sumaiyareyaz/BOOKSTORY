// server.js
require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
console.log("Serving static from:", path.join(__dirname, 'public'));


const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'elibrary',
  waitForConnections: true,
  connectionLimit: 10
});

app.get('/api/dashboard/summary', async (req, res) => {
  try {
    const [booksRows] = await pool.query('SELECT COUNT(*) AS totalBooks FROM books');
    const [usersRows] = await pool.query('SELECT COUNT(*) AS totalUsers FROM users');
    const [borrowRows] = await pool.query("SELECT COUNT(*) AS currentlyBorrowed FROM borrow_records WHERE returned_at IS NULL");
    const [overdueRows] = await pool.query("SELECT COUNT(*) AS overdueCount FROM borrow_records WHERE returned_at IS NULL AND due_date < CURDATE()");

    const totalBooks = booksRows[0]?.totalBooks || 0;
    const totalUsers = usersRows[0]?.totalUsers || 0;
    const currentlyBorrowed = borrowRows[0]?.currentlyBorrowed || 0;
    const overdueCount = overdueRows[0]?.overdueCount || 0;

    res.json({ totalBooks, totalUsers, currentlyBorrowed, overdueCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

app.get('/api/dashboard/categories', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT category, COUNT(*) AS count FROM books GROUP BY category');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

app.get('/api/dashboard/availability', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT COALESCE(SUM(total_copies),0) AS total, COALESCE(SUM(available_copies),0) AS available FROM books');
    res.json(rows[0] || { total: 0, available: 0 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

app.get('/api/dashboard/recent-borrows', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT br.id, br.borrowed_at, br.due_date, br.returned_at,
             u.name AS user_name, b.title AS book_title
      FROM borrow_records br
      JOIN users u ON u.id = br.user_id
      JOIN books b ON b.id = br.book_id
      ORDER BY br.borrowed_at DESC
      LIMIT 10
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on http://localhost:${PORT}`));


