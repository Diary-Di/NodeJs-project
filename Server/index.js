require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = 5000 || 5000;

// PostgreSQL connection using .env
const pool = new Pool(); // Reads from .env automatically

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('Hello from Express!');
});

// Route to insert student data
app.post('/api/etudiant', async (req, res) => {
  const { numeroet, nomet, moyenne } = req.body;

  // Basic validation
  if (!numeroet || !nomet || isNaN(parseFloat(moyenne))) {
    return res.status(400).json({ error: 'Champs invalides' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO etudiant (numeroet, nomet, moyenne) VALUES ($1, $2, $3) RETURNING *',
      [numeroet.trim(), nomet.trim(), parseFloat(moyenne)]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Erreur lors de l\'insertion:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.get('/api/etudiant', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM etudiant');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/statistics', async (req, res) => {
  try {
    const result = await pool.query('SELECT moyenne FROM etudiant');
    const moyennes = result.rows.map(row => parseFloat(row.moyenne));
    const count = moyennes.length;

    if (count === 0) {
      return res.json({ average: 0, min: 0, max: 0, count: 0 });
    }

    const average = (moyennes.reduce((a, b) => a + b, 0) / count).toFixed(2);
    const min = Math.min(...moyennes).toFixed(2);
    const max = Math.max(...moyennes).toFixed(2);

    res.json({ average, min, max, count });
  } catch (err) {
    console.error("Erreur dans /api/statistics:", err);
    res.status(500).json({ error: "Erreur serveur lors de la récupération des statistiques" });
  }
});

app.delete('/api/etudiant/:numeroet', async (req, res) => {
  const { numeroet } = req.params;
  try {
    await pool.query('DELETE FROM etudiant WHERE numeroet = $1', [numeroet]);
    res.json({ message: 'Student deleted successfully' });
  } catch (err) {
    console.error('Error deleting student:', err);
    res.status(500).json({ error: 'Failed to delete student' });
  }
});

app.put('/api/etudiant/:numeroet', async (req, res) => {
  const { numeroet } = req.params;
  const { nomet, moyenne } = req.body;
  try {
    await pool.query(
      'UPDATE etudiant SET nomet = $1, moyenne = $2 WHERE numeroet = $3',
      [nomet, moyenne, numeroet]
    );
    res.json({ message: 'Student updated successfully' });
  } catch (err) {
    console.error('Error updating student:', err);
    res.status(500).json({ error: 'Failed to update student' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend server running at http://localhost:${PORT}`);
});
