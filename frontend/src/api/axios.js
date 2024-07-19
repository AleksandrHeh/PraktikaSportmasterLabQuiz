import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:3000/api', // Базовый URL вашего API
  timeout: 10000,  // Таймаут запроса
  headers: {
    'Content-Type': 'application/json',
  },
});

export default instance;
