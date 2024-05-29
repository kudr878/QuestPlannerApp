const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const { sendMailMessageAsync } = require('./emailSender');

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
  
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

app.get('/', (req, res) => {
  res.send('Hello, World!');
});


const verificationCodes = {};

app.post('/sendVerificationCode', async (req, res) => {
  const { email } = req.body;
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  verificationCodes[email] = code;

  try {
    await sendMailMessageAsync(email, code);
    res.send({ message: 'Verification code sent' });
  } catch (error) {
    res.status(500).send({ error: 'Error sending verification code' });
  }
});

app.post('/verifyCode', (req, res) => {
  const { email, code } = req.body;
  if (verificationCodes[email] === code) {
    delete verificationCodes[email];
    res.send({ message: 'Code verified' });
  } else {
    res.status(400).send({ error: 'Invalid code' });
  }
});
app.post('/register', async (req, res) => {
  const { username, email, password, character_id } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const result = await pool.query(
      'INSERT INTO users (username, email, password_hash, character_id, experience, level) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, username, email, character_id, experience, level', 
      [username, email, hashedPassword, character_id, 0, 1]  
    );
    const user = result.rows[0];
    const token = jwt.sign({ id: user.id, username: user.username }, secretKey, { expiresIn: '1h' });
    res.status(201).send({ token, user });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

// Обновление запроса для входа пользователя
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
      const result = await pool.query(
          'SELECT id, username, email, password_hash, character_id, experience, level FROM users WHERE email = $1',  
          [email]
      );
      if (result.rows.length === 0) {
          return res.status(404).send({ error: 'User not found' });
      }

      const user = result.rows[0];
      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (isMatch) {
          const token = jwt.sign({ id: user.id, username: user.username, email: user.email }, secretKey, { expiresIn: '1h' });
          res.send({ token, user });
      } else {
          res.status(401).send({ error: 'Invalid email or password' });
      }
  } catch (err) {
      res.status(500).send({ error: err.message });
  }
});

app.get('/users/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const query = `
    SELECT u.id, u.username, u.email, u.character_id, c.class_name, u.experience, u.level
    FROM users u
      LEFT JOIN characters c ON u.character_id = c.id
      WHERE u.id = $1;
    `;
    const userResult = await pool.query(query, [id]);

    if (userResult.rows.length > 0) {
      const user = userResult.rows[0];
      res.json({
        id: user.id,
        username: user.username,
        email: user.email,
        character_id: user.character_id,
        className: user.class_name || 'No class assigned',
        experience: user.experience,
        level: user.level
      });
    } else {
      res.status(404).send({ error: 'User not found' });
    }
  } catch (err) {
    console.error('Error fetching user:', err.message);
    res.status(500).send({ error: 'Internal server error' });
  }
});


app.put('/users/:id', async (req, res) => {
  const { id } = req.params;
  const { oldPassword, newPassword, username, email, character_id } = req.body;

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

      if (character_id && character_id !== user.character_id) {
          await pool.query('UPDATE users SET character_id = $1 WHERE id = $2', [character_id, id]);
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
  
  app.get('/tasks/:userId', async (req, res) => {
    const { userId } = req.params;
  
    try {
      const tasksQuery = `
        SELECT t.*, json_agg(s) as subtasks
        FROM tasks t
        LEFT JOIN subtasks s ON t.id = s.task_id
        WHERE t.owner_id = $1
        GROUP BY t.id
      `;
      const tasksResult = await pool.query(tasksQuery, [userId]);
      res.json(tasksResult.rows);
    } catch (err) {
      console.error('Error fetching tasks and subtasks:', err.message);
      res.status(500).send({ error: 'Internal server error' });
    }
  });
  
app.post('/tasks', async (req, res) => {
  const { owner_id, title, description, difficulty_id, deadline_type, deadline_date, repeat_interval, repeat_type } = req.body;

  try {
    const newTask = await pool.query(
      'INSERT INTO tasks (owner_id, title, description, difficulty_id, deadline_type, deadline_date, repeat_interval, repeat_type) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [owner_id, title, description, difficulty_id, deadline_type, deadline_date, repeat_interval, repeat_type]
    );
    res.status(201).json(newTask.rows[0]);
  } catch (err) {
    console.error('Error creating task:', err.message);
    res.status(400).send({ error: 'Error creating task' });
  }
});

app.put('/tasks/:taskId', async (req, res) => {
  const { taskId } = req.params;
  const { title, description, is_completed } = req.body;

  try {
    const updatedTask = await pool.query(
      'UPDATE tasks SET title = $1, description = $2, is_completed = $3 WHERE id = $4 RETURNING *',
      [title, description, is_completed, taskId]
    );
    res.json(updatedTask.rows[0]);
  } catch (err) {
    console.error('Error updating task:', err.message);
    res.status(400).send({ error: 'Error updating task' });
  }
});

app.delete('/tasks/:taskId', async (req, res) => {
  const { taskId } = req.params;

  try {
    await pool.query(
      'DELETE FROM tasks WHERE id = $1',
      [taskId]
    );
    res.send({ message: 'Task deleted successfully' });
  } catch (err) {
    console.error('Error deleting task:', err.message);
    res.status(500).send({ error: 'Internal server error' });
  }
});

app.post('/subtasks', async (req, res) => {
  const { task_id, content } = req.body;

  try {
    const newSubtask = await pool.query(
      'INSERT INTO subtasks (task_id, content) VALUES ($1, $2) RETURNING *',
      [task_id, content]
    );
    res.status(201).json(newSubtask.rows[0]);
  } catch (err) {
    console.error('Error creating subtask:', err.message);
    res.status(400).send({ error: 'Error creating subtask' });
  }
});

app.put('/subtasks/:subtaskId', async (req, res) => {
  const { subtaskId } = req.params;
  const { content, is_completed } = req.body;

  try {
    const updatedSubtask = await pool.query(
      'UPDATE subtasks SET content = $1, is_completed = $2 WHERE id = $3 RETURNING *',
      [content, is_completed, subtaskId]
    );
    res.json(updatedSubtask.rows[0]);
  } catch (err) {
    console.error('Error updating subtask:', err.message);
    res.status(400).send({ error: 'Error updating subtask' });
  }
});

app.delete('/subtasks/:subtaskId', async (req, res) => {
  const { subtaskId } = req.params;

  try {
    await pool.query(
      'DELETE FROM subtasks WHERE id = $1',
      [subtaskId]
    );
    res.send({ message: 'Subtask deleted successfully' });
  } catch (err) {
    console.error('Error deleting subtask:', err.message);
    res.status(500).send({ error: 'Internal server error' });
  }
});
