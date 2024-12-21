const express = require('express');
const session = require('express-session');
const passport = require('passport');
const Auth0Strategy = require('passport-auth0');

// Настройки приложения
const app = express();
const PORT = 3000;

// Настройки Auth0
const auth0Strategy = new Auth0Strategy(
  {
    domain: 'dev-a767s6hiwtzr6x4y.us.auth0.com', // Ваш домен Auth0
    clientID: 'ВАШ_CLIENT_ID', // Замените на ваш Client ID
    clientSecret: 'ВАШ_CLIENT_SECRET', // Замените на ваш Client Secret
    callbackURL: 'http://localhost:3000/callback', // URL для обратного вызова
  },
  (accessToken, refreshToken, extraParams, profile, done) => {
    // Профиль пользователя передаётся сюда после успешного входа
    return done(null, profile);
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
    secret: 'your_secret_key', // Секрет для шифрования сессий
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

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
    res.redirect('/dashboard'); // Перенаправление после успешного входа
  }
);

// Маршрут для защищённой страницы
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

