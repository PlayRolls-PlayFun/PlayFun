require('dotenv').config(); // Подключение переменных окружения из .env

const express = require('express');
const session = require('express-session');
const passport = require('passport');
const Auth0Strategy = require('passport-auth0');

const app = express();
const PORT = 3000;

// Настройка стратегии Auth0
const auth0Strategy = new Auth0Strategy(
  {
    domain: process.env.DOMAIN, // Домен из Auth0
    clientID: process.env.CLIENT_ID, // Client ID из Auth0
    clientSecret: process.env.CLIENT_SECRET, // Client Secret из Auth0
    callbackURL: 'http://localhost:3000/callback', // URL для обратного вызова
  },
  (accessToken, refreshToken, extraParams, profile, done) => {
    return done(null, profile); // Передача профиля пользователя
  }
);

passport.use(auth0Strategy);

// Сериализация пользователя
passport.serializeUser((user, done) => {
  done(null, user);
});

// Десериализация пользователя
passport.deserializeUser((user, done) => {
  done(null, user);
});

// Настройка сессий
app.use(
  session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Обслуживание статических файлов из папки public
app.use(express.static('public'));

// Маршрут для входа
app.get(
  '/login',
  passport.authenticate('auth0', { scope: 'openid email profile' })
);

// Маршрут для обработки обратного вызова
app.get(
  '/callback',
  passport.authenticate('auth0', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/dashboard'); // Перенаправление на профиль после успешного входа
  }
);

// Защищённая страница
app.get('/dashboard', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/login');
  }
  res.send(`
    <h1>Добро пожаловать, ${req.user.displayName || req.user.nickname}!</h1>
    <img src="${req.user.picture}" alt="Avatar" style="border-radius: 50%; width: 100px;">
    <p>Email: ${req.user.emails ? req.user.emails[0].value : 'Не указан'}</p>
    <a href="/logout">Выйти</a>
  `);
});

// Маршрут для выхода
app.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});


