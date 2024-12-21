require('dotenv').config(); // Подключение .env

const express = require('express');
const session = require('express-session');
const passport = require('passport');
const Auth0Strategy = require('passport-auth0');

const app = express();
const PORT = 3000;

// Проверка значений из .env
console.log('CLIENT_ID:', process.env.CLIENT_ID);
console.log('CLIENT_SECRET:', process.env.CLIENT_SECRET);
console.log('DOMAIN:', process.env.DOMAIN);

// Настройка Auth0
const auth0Strategy = new Auth0Strategy(
  {
    domain: process.env.DOMAIN,
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/callback',
  },
  (accessToken, refreshToken, extraParams, profile, done) => {
    return done(null, profile);
  }
);

passport.use(auth0Strategy);

passport.serializeUser((user, done) => {
  done(null, user);
});

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
    res.redirect('/dashboard');
  }
);

// Защищённый маршрут
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
