const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'PraktikaQuiz',
  password: 'BUGLb048',
  port: 5432,
});

app.use(cors());
app.use(bodyParser.json()); // для парсинга JSON в теле запросов

const jwtSecret = 'your_jwt_secret'; // секретный ключ для JWT

// Маршрут для получения вопросов и ответов
app.get('/api/questions', async (req, res) => {
  try {
    const questionsResult = await pool.query('SELECT * FROM questions');
    const questions = questionsResult.rows;

    for (let question of questions) {
      const answersResult = await pool.query('SELECT * FROM answers WHERE question_id = $1', [question.question_id]);
      question.answers = answersResult.rows;
    }

    res.json(questions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/register', async (req, res) => {
  const { username, password, confirmPassword } = req.body;

  if (!username || !password || !confirmPassword) {
    return res.status(400).json({ message: 'Все поля должны быть заполнены' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Пароли не совпадают' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING user_id',
      [username, hashedPassword]
    );
    const token = jwt.sign({ userId: result.rows[0].user_id }, jwtSecret, { expiresIn: '1h' });
    res.status(201).json({ userId: result.rows[0].user_id, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Имя пользователя и пароль обязательны' });
  }

  try {
    const userResult = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    const user = userResult.rows[0];

    if (!user) {
      return res.status(400).json({ message: 'Неправильное имя пользователя или пароль' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Неправильное имя пользователя или пароль' });
    }

    const token = jwt.sign({ userId: user.user_id }, jwtSecret, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
