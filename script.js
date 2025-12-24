// Конфигурация
const API_URL = '/api/server-status'; // Относительный путь к API

// Элементы DOM
const statusElement = document.querySelector('.status');
const playersElement = document.querySelector('.players');

// Функция для обновления статуса сервера
async function updateServerStatus() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        
        if (response.ok) {
            // Обновляем статус
            if (data.online) {
                statusElement.innerHTML = '🟢 Онлайн';
                statusElement.className = 'status online';
            } else {
                statusElement.innerHTML = '🔴 Оффлайн';
                statusElement.className = 'status offline';
            }
            
            // Обновляем количество игроков
            playersElement.textContent = `Игроков: ${data.players}/${data.maxPlayers}`;
            
            console.log('Server status updated:', data);
        } else {
            throw new Error('Failed to fetch server status');
        }
    } catch (error) {
        console.error('Error updating server status:', error);
        // Показываем ошибку
        statusElement.innerHTML = '⚠️ Ошибка';
        statusElement.className = 'status error';
        playersElement.textContent = 'Не удалось получить данные';
    }
}

// Обновляем статус при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    updateServerStatus();
    
    // Обновляем статус каждые 30 секунд
    setInterval(updateServerStatus, 30000);
});

// Добавляем индикатор последнего обновления
function addLastUpdateIndicator() {
    const serverStatus = document.querySelector('.server-status');
    const lastUpdateElement = document.createElement('div');
    lastUpdateElement.className = 'last-update';
    lastUpdateElement.textContent = 'Обновлено: только что';
    serverStatus.appendChild(lastUpdateElement);
    
    // Обновляем время последнего обновления
    setInterval(() => {
        const now = new Date();
        lastUpdateElement.textContent = `Обновлено: ${now.toLocaleTimeString()}`;
    }, 30000);
}

// Добавляем индикатор при загрузке
document.addEventListener('DOMContentLoaded', addLastUpdateIndicator);