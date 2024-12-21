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

// Регистрация
registerButton.addEventListener('click', async () => {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    hideError(registerError);

    if (!username || !password) {
        showError(registerError, 'Все поля должны быть заполнены.');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (response.ok) {
            alert('Регистрация успешна! Теперь вы можете войти.');
            registerSection.style.display = 'none';
            loginSection.style.display = 'block';
        } else {
            showError(registerError, data.error || 'Ошибка регистрации.');
        }
    } catch (error) {
        showError(registerError, 'Ошибка соединения с сервером.');
    }
});

// Вход
loginButton.addEventListener('click', async () => {
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
    hideError(loginError);

    if (!username || !password) {
        showError(loginError, 'Все поля должны быть заполнены.');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('token', data.token); // Сохраняем токен
            alert('Добро пожаловать, ' + username + '!');
            window.location.href = './main.html'; // Переход на защищенную страницу
        } else {
            showError(loginError, data.error || 'Ошибка входа.');
        }
    } catch (error) {
        showError(loginError, 'Ошибка соединения с сервером.');
    }
});

