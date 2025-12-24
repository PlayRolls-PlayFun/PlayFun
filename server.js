const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Exaroton API configuration
const EXAROTON_API_URL = 'https://api.exaroton.com/v1';
const API_TOKEN = process.env.EXAROTON_API_TOKEN;
const SERVER_ID = process.env.EXAROTON_SERVER_ID;

// Функция для получения статуса через mcstatus.io API
async function getMcStatusInfo(host, port) {
    try {
        const response = await axios.get(`https://api.mcstatus.io/v2/status/java/${host}:${port}`, {
            timeout: 10000
        });
        
        if (response.data && response.data.online !== undefined) {
            // Проверяем если сервер в режиме "сна" (Exaroton)
            const isSleeping = response.data.version?.name_clean?.includes('Sleeping') || 
                              response.data.version?.name_clean?.includes('◉ Sleeping') ||
                              response.data.version?.protocol === -1;
            
            return {
                online: response.data.online && !isSleeping,
                players: response.data.players?.online || 0,
                maxPlayers: response.data.players?.max || 400,
                version: response.data.version?.name || 'Unknown',
                description: response.data.motd?.clean || 'Minecraft Server',
                sleeping: isSleeping
            };
        }
        
        return { online: false, players: 0, maxPlayers: 400, sleeping: false };
    } catch (error) {
        console.log('McStatus API error:', error.message);
        return { online: false, players: 0, maxPlayers: 400, sleeping: false };
    }
}

// Cache для статуса сервера
let serverStatus = {
    online: false,
    players: 0,
    maxPlayers: 0,
    lastUpdate: null
};

// Функция для получения статуса сервера
async function getServerStatus() {
    try {
        // Проверяем, что API токен и Server ID настроены правильно
        if (!API_TOKEN || API_TOKEN === 'your_api_token_here' || 
            !SERVER_ID || SERVER_ID === 'your_server_id_here' ||
            SERVER_ID.includes('.exaroton.me')) {
            
            console.log('API not configured properly, trying mcstatus.io API...');
            
            // Получаем статус через mcstatus.io
            const mcResult = await getMcStatusInfo('PlayFun.exaroton.me', 30775);
            serverStatus = {
                online: mcResult.online,
                players: mcResult.players,
                maxPlayers: mcResult.maxPlayers,
                lastUpdate: new Date().toISOString(),
                status: mcResult.sleeping ? 'Sleeping (Exaroton)' : (mcResult.online ? 'Online (McStatus API)' : 'Offline'),
                motd: mcResult.description || 'PlayFun Server'
            };
            
            console.log('McStatus API result:', serverStatus);
            return serverStatus;
        }

        // Используем Exaroton API если настроен
        const response = await axios.get(`${EXAROTON_API_URL}/servers/${SERVER_ID}`, {
            headers: {
                'Authorization': `Bearer ${API_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });

        const server = response.data.data;
        
        serverStatus = {
            online: server.status === 2, // 2 = online в Exaroton API
            players: server.players?.count || 0,
            maxPlayers: server.players?.max || 0,
            lastUpdate: new Date().toISOString(),
            status: getStatusText(server.status),
            motd: server.motd || 'Minecraft Server'
        };

        console.log('Exaroton API result:', serverStatus);
        return serverStatus;
    } catch (error) {
        console.error('Error fetching server status:', error.message);
        
        // Используем mcstatus.io как запасной вариант
        const mcResult = await getMcStatusInfo('PlayFun.exaroton.me', 30775);
        serverStatus = {
            online: mcResult.online,
            players: mcResult.players,
            maxPlayers: mcResult.maxPlayers,
            lastUpdate: new Date().toISOString(),
            status: mcResult.sleeping ? 'Sleeping (Exaroton)' : (mcResult.online ? 'Online (Fallback McStatus)' : 'Offline'),
            motd: mcResult.description || 'PlayFun Server'
        };
        
        return serverStatus;
    }
}

// Функция для преобразования статуса в текст
function getStatusText(status) {
    switch (status) {
        case 0: return 'Offline';
        case 1: return 'Starting';
        case 2: return 'Online';
        case 3: return 'Stopping';
        case 4: return 'Restarting';
        case 5: return 'Saving';
        case 6: return 'Loading';
        case 7: return 'Crashed';
        case 8: return 'Pending';
        case 10: return 'Preparing';
        default: return 'Unknown';
    }
}

// API endpoint для получения статуса
app.get('/api/server-status', async (req, res) => {
    try {
        const status = await getServerStatus();
        res.json(status);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Обновление статуса каждые 30 секунд
setInterval(getServerStatus, 30000);

// Первоначальное получение статуса
getServerStatus();

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('Visit: http://localhost:3000');
});