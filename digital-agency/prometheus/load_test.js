import http from 'k6/http';
import { sleep, check } from 'k6';
import { Counter, Gauge, Rate } from 'k6/metrics';

// Настройка теста
export const options = {
  vus: 30, // 30 виртуальных пользователей
  duration: '30s', // Продолжительность теста - 30 секунд
  thresholds: {
    http_req_duration: ['p(95)<3000'], // 95% запросов должны выполняться быстрее 3000 мс
    'http_req_duration{endpoint:login}': ['p(95)<3000'], // Требования для логина
    'http_req_duration{endpoint:projects}': ['p(95)<3000'],
    'checks': ['rate>0.7'], // 70% проверок должны быть успешными
  },
};

// Пользовательские метрики
const errorCounter = new Counter('api_errors');
const responseTime = new Gauge('response_time');
const successRate = new Rate('success_rate');

// Тестовые данные
const BASE_URL = 'http://localhost:5000';
const TEST_USERS = [
  { email: 'admin@adm.ru', password: 'emil123123' },
  { email: 'mih@client.ru', password: 'emil123123' },
  { email: 'vas@ka.ru', password: 'emil123123' },
  { email: 'nest@dig.ru', password: 'emil123123' },
  // Добавьте больше пользователей при необходимости
];

// Основная функция теста
export default function () {
  // Выбираем случайного пользователя
  const user = TEST_USERS[Math.floor(Math.random() * TEST_USERS.length)];
  
  // 1. Авторизация
  const loginStart = new Date();
  const loginRes = http.post(`${BASE_URL}/auth/login`, JSON.stringify({
    email: user.email,
    password: user.password
  }), {
    headers: { 'Content-Type': 'application/json' },
    tags: { endpoint: 'login' }
  });
  
  const loginDuration = new Date() - loginStart;
  responseTime.add(loginDuration, { endpoint: 'login' });
  
  const loginSuccess = check(loginRes, {
    'успешная авторизация': (r) => r.status === 200 || r.status === 201,
    'получен токен': (r) => r.json('accessToken') !== undefined,
  });
  
  successRate.add(loginSuccess, { request: 'login' });
  
  if (!loginSuccess) {
    errorCounter.add(1, { endpoint: 'login' });
    console.log(`Ошибка авторизации: ${loginRes.status} ${loginRes.body}`);
    return;
  }
  
  const token = loginRes.json('accessToken');
  
  // 2. Получение проектов
  const projectsStart = new Date();
  const projectsRes = http.get(`${BASE_URL}/projects`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    tags: { endpoint: 'projects' }
  });
  
  const projectsDuration = new Date() - projectsStart;
  responseTime.add(projectsDuration, { endpoint: 'projects' });
  
  const projectsSuccess = check(projectsRes, {
    'успешное получение проектов': (r) => r.status === 200 || r.status === 403,
    'получен массив проектов': (r) => r.status === 200 ? Array.isArray(r.json()) : true,
  });
  
  successRate.add(projectsSuccess, { request: 'projects' });
  
  if (!projectsSuccess) {
    errorCounter.add(1, { endpoint: 'projects' });
    console.log(`Ошибка получения проектов: ${projectsRes.status}`);
  }
  
  // 3. Получение чатов
  const chatsStart = new Date();
  const chatsRes = http.get(`${BASE_URL}/chats`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    tags: { endpoint: 'chats' }
  });
  
  const chatsDuration = new Date() - chatsStart;
  responseTime.add(chatsDuration, { endpoint: 'chats' });
  
  const chatsSuccess = check(chatsRes, {
    'успешное получение чатов': (r) => r.status === 200 || r.status === 403,
  });
  
  successRate.add(chatsSuccess, { request: 'chats' });
  
  if (!chatsSuccess) {
    errorCounter.add(1, { endpoint: 'chats' });
    console.log(`Ошибка получения чатов: ${chatsRes.status}`);
  }
  
  // 4. Получение клиентов
  const clientsStart = new Date();
  const clientsRes = http.get(`${BASE_URL}/clients`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    tags: { endpoint: 'clients' }
  });
  
  const clientsDuration = new Date() - clientsStart;
  responseTime.add(clientsDuration, { endpoint: 'clients' });
  
  const clientsSuccess = check(clientsRes, {
    'успешное получение клиентов': (r) => r.status === 200 || r.status === 403,
  });
  
  successRate.add(clientsSuccess, { request: 'clients' });
  
  if (!clientsSuccess) {
    errorCounter.add(1, { endpoint: 'clients' });
    console.log(`Ошибка получения клиентов: ${clientsRes.status}`);
  }
  
  // Пауза между итерациями (чтобы получить ~75 запросов/мин от 30 пользователей)
  // 30 пользователей * 60 секунд / 75 запросов = ~24 секунды на полный цикл
  // 24 секунды / 4 запроса = ~6 секунд между запросами
  sleep(6);
} 