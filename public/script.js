// Получение кнопок с HTML-страницы
const loginButton = document.getElementById('loginButton');
const logoutButton = document.getElementById('logoutButton');
const dashboardButton = document.getElementById('dashboardButton');

// Перенаправление на сервер для входа
loginButton.addEventListener('click', () => {
  window.location.href = '/login';
});

// Перенаправление на сервер для выхода
logoutButton.addEventListener('click', () => {
  window.location.href = '/logout';
});

// Перенаправление на защищённую страницу
dashboardButton.addEventListener('click', () => {
  window.location.href = '/dashboard';
});



