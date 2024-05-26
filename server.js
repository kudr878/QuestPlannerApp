const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');

const app = express();
const port = 3000;
const pool = new Pool({
  user: 'app_user',
  host: '192.168.0.40',
  database: 'quest_planner_db',
  password: '#*qwLQAWuhjtLiq3uhtoijfas',
  port: 5432,
});

app.use(bodyParser.json());

const secretKey = 'd6b0efe0490db6d5ea1da75110a528f23bd2c86e4685a002daf36b1b5f67230224ffa5b8b0efec9baa1bfaf0b1cd093c';

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const result = await pool.query(
      'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email', 
      [username, email, hashedPassword]
    );
    const user = result.rows[0];
    const token = jwt.sign({ id: user.id, username: user.username }, secretKey, { expiresIn: '1h' });
    res.status(201).send({ token, user });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});
app.post('/login', async (req, res) => {
    const { email, password } = req.body;  
  
    try {
        const result = await pool.query(
            'SELECT id, username, email, password_hash FROM users WHERE email = $1',  
            [email]
        );
        if (result.rows.length === 0) {
            return res.status(404).send({ error: 'User not found' });
        }

        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (isMatch) {
            const token = jwt.sign({ id: user.id, username: user.username, email: user.email }, secretKey, { expiresIn: '1h' });
            res.send({ token, user: { id: user.id, username: user.username, email: user.email } });
        } else {
            res.status(401).send({ error: 'Invalid email or password' });
        }
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});


app.put('/users/:id', async (req, res) => {
    const { id } = req.params;
    const { oldPassword, newPassword, username, email } = req.body;

    try {
        const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
        if (userResult.rows.length === 0) {
            return res.status(404).send({ error: 'User not found' });
        }
        const user = userResult.rows[0];

        if (oldPassword && newPassword) {
            const isMatch = await bcrypt.compare(oldPassword, user.password_hash);
            if (!isMatch) {
                return res.status(401).send({ error: 'Current password is incorrect' });
            }
            const hashedNewPassword = await bcrypt.hash(newPassword, 10);
            await pool.query('UPDATE users SET password_hash = $1 WHERE id = $2', [hashedNewPassword, id]);
        }

        if (email && email !== user.email) {
            const emailResult = await pool.query('SELECT id FROM users WHERE email = $1 AND id != $2', [email, id]);
            if (emailResult.rows.length > 0) {
                return res.status(409).send({ error: 'This email address is already in use by another account' });
            }
            await pool.query('UPDATE users SET email = $1 WHERE id = $2', [email, id]);
        }

        if (username && username !== user.username) {
            await pool.query('UPDATE users SET username = $1 WHERE id = $2', [username, id]);
        }

        res.send({ message: 'User updated successfully' });
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).send({ error: 'Internal server error' });
    }
});



  app.post('/verifyPassword', async (req, res) => {
    const { username, password } = req.body;
    try {
      const userResult = await pool.query('SELECT password_hash FROM users WHERE username = $1', [username]);
      if (userResult.rows.length === 0) {
        return res.status(404).send({ error: 'User not found' });
      }
      const user = userResult.rows[0];
      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) {
        return res.status(401).send({ error: 'Invalid password' });
      }
      res.send({ message: 'Password verified' });
    } catch (err) {
      res.status(500).send({ error: err.message });
    }
  });
  

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
