// Получаем элементы
const loginSection = document.getElementById('loginSection');
const registerSection = document.getElementById('registerSection');
const loginError = document.getElementById('loginError');
const registerError = document.getElementById('registerError');
const loginButton = document.getElementById('loginButton');
const registerButton = document.getElementById('registerButton');
const showRegisterButton = document.getElementById('showRegisterButton');
const showLoginButton = document.getElementById('showLoginButton');

// Функция для показа ошибок
function showError(element, message) {
    element.textContent = message;
    element.style.display = 'block';
}

// Функция для скрытия ошибок
function hideError(element) {
    element.style.display = 'none';
}

// Переключение между секциями
showRegisterButton.addEventListener('click', () => {
    loginSection.style.display = 'none';
    registerSection.style.display = 'block';
});

showLoginButton.addEventListener('click', () => {
    registerSection.style.display = 'none';
    loginSection.style.display = 'block';
});

// Регистрация пользователя
registerButton.addEventListener('click', () => {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    hideError(registerError);

    if (!username || !password) {
        showError(registerError, 'Все поля должны быть заполнены.');
        return;
    }

    // Получаем пользователей из LocalStorage
    const users = JSON.parse(localStorage.getItem('users')) || {};

    if (users[username]) {
        showError(registerError, 'Пользователь с таким логином уже существует.');
    } else {
        // Сохраняем нового пользователя
        users[username] = password;
        localStorage.setItem('users', JSON.stringify(users));
        alert('Регистрация успешна! Теперь вы можете войти.');
        registerSection.style.display = 'none';
        loginSection.style.display = 'block';
    }
});

// Вход в систему
loginButton.addEventListener('click', () => {
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
    hideError(loginError);

    if (!username || !password) {
        showError(loginError, 'Все поля должны быть заполнены.');
        return;
    }

    // Получаем пользователей из LocalStorage
    const users = JSON.parse(localStorage.getItem('users')) || {};

    if (users[username] && users[username] === password) {
        window.location.href = './main.html'; // Перенаправляем на главную страницу
    } else {
        showError(loginError, 'Неверный логин или пароль.');
    }
});
