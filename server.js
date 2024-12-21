const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const PORT = 3000;
const SECRET = 'your_jwt_secret'; // Секретный ключ для JWT

// Настройка базы данных SQLite
const db = new sqlite3.Database('./users.db', (err) => {
    if (err) {
        console.error('Ошибка при подключении к базе данных:', err.message);
    } else {
        console.log('Подключение к базе данных SQLite успешно!');
        // Создаем таблицу пользователей, если она не существует
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )`);
    }
});

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Регистрация
app.post('/register', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Введите логин и пароль.' });
    }

    // Хешируем пароль
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            return res.status(500).json({ error: 'Ошибка при хешировании пароля.' });
        }

        // Сохраняем пользователя в базе данных
        const query = `INSERT INTO users (username, password) VALUES (?, ?)`;
        db.run(query, [username, hashedPassword], (err) => {
            if (err) {
                if (err.message.includes('UNIQUE constraint failed')) {
                    return res.status(400).json({ error: 'Пользователь с таким именем уже существует.' });
                }
                return res.status(500).json({ error: 'Ошибка при сохранении пользователя.' });
            }
            res.status(201).json({ message: 'Регистрация успешна!' });
        });
    });
});

// Вход
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Введите логин и пароль.' });
    }

    const query = `SELECT * FROM users WHERE username = ?`;
    db.get(query, [username], (err, user) => {
        if (err) {
            return res.status(500).json({ error: 'Ошибка при проверке пользователя.' });
        }

        if (!user) {
            return res.status(400).json({ error: 'Неверный логин или пароль.' });
        }

        // Проверяем пароль
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err || !isMatch) {
                return res.status(400).json({ error: 'Неверный логин или пароль.' });
            }

            // Генерируем токен
            const token = jwt.sign({ id: user.id, username: user.username }, SECRET, { expiresIn: '1h' });
            res.json({ message: 'Вход выполнен успешно!', token });
        });
    });
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
