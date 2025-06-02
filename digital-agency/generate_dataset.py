import pandas as pd
import numpy as np
import json
from datetime import datetime, timedelta
import random
import os

# Создаем директорию для данных, если она не существует
if not os.path.exists('data'):
    os.makedirs('data')

# Функция для генерации метрик сервера (большой датасет)
def generate_server_metrics(start_date, days=90, interval_minutes=5):
    print(f"Генерация метрик сервера за {days} дней с интервалом {interval_minutes} минут...")
    
    # Расчет количества записей
    total_records = (days * 24 * 60) // interval_minutes
    print(f"Будет сгенерировано примерно {total_records} записей")
    
    timestamps = []
    cpu_usage = []
    memory_usage = []
    disk_usage = []
    network_traffic = []
    response_time = []
    active_users = []
    error_count = []
    server_id = []
    
    current_date = start_date
    end_date = start_date + timedelta(days=days)
    
    # Базовые значения для разных серверов
    servers = {
        'srv1': {'disk': 60.0, 'cpu_base': 25, 'mem_base': 45, 'net_base': 1500},
        'srv2': {'disk': 55.0, 'cpu_base': 30, 'mem_base': 50, 'net_base': 2000},
        'srv3': {'disk': 40.0, 'cpu_base': 20, 'mem_base': 40, 'net_base': 1200}
    }
    
    # Создание недельных и дневных паттернов для реалистичности
    day_of_week_factors = {
        0: 0.7,  # Понедельник
        1: 0.8,  # Вторник
        2: 0.9,  # Среда
        3: 1.0,  # Четверг
        4: 0.95, # Пятница
        5: 0.5,  # Суббота
        6: 0.4   # Воскресенье
    }
    
    # Добавление плановых событий (например, бэкапы, обновления)
    planned_events = []
    current = start_date
    while current < end_date:
        # Еженедельное обновление по воскресеньям в 3 утра
        if current.weekday() == 6 and current.hour == 3 and current.minute < 30:
            planned_events.append((current, current + timedelta(minutes=30), 'update'))
        
        # Ежедневное резервное копирование в 1 утра
        if current.hour == 1 and current.minute < 45:
            planned_events.append((current, current + timedelta(minutes=45), 'backup'))
            
        # Ежемесячное обслуживание (первый день месяца)
        if current.day == 1 and current.hour == 2:
            planned_events.append((current, current + timedelta(hours=2), 'maintenance'))
            
        current += timedelta(days=1)
    
    # Создание случайных инцидентов
    incidents = []
    incident_duration_hours = [0.5, 1, 2, 3, 4]  # Возможная продолжительность инцидентов в часах
    
    # Генерация от 5 до 15 случайных инцидентов
    num_incidents = random.randint(5, 15)
    for _ in range(num_incidents):
        incident_start = start_date + timedelta(days=random.randint(0, days-1), 
                                               hours=random.randint(0, 23))
        duration = random.choice(incident_duration_hours)
        incident_end = incident_start + timedelta(hours=duration)
        incidents.append((incident_start, incident_end, 'incident'))
    
    # Создание сезонных трендов (например, повышение нагрузки в определенные месяцы)
    month_factors = {
        1: 1.0,   # Январь
        2: 0.9,   # Февраль
        3: 1.1,   # Март
        4: 1.2,   # Апрель
        5: 1.3,   # Май
        6: 1.2,   # Июнь
        7: 1.0,   # Июль
        8: 0.9,   # Август
        9: 1.1,   # Сентябрь
        10: 1.2,  # Октябрь
        11: 1.3,  # Ноябрь
        12: 1.4   # Декабрь (праздничный сезон)
    }
    
    # Создание паттернов для имитации реальной нагрузки
    counter = 0
    while current_date < end_date:
        # Обновление счетчика для отображения прогресса
        counter += 1
        if counter % 1000 == 0:
            progress = (current_date - start_date).total_seconds() / (end_date - start_date).total_seconds() * 100
            print(f"Прогресс: {progress:.1f}% ({counter} записей)")
        
        # Выбор случайного сервера для этой записи
        server = random.choice(list(servers.keys()))
        server_config = servers[server]
        
        # Базовые значения с суточным циклом
        hour = current_date.hour
        minute = current_date.minute
        day_of_week = current_date.weekday()
        month = current_date.month
        
        # Применение дневных и недельных факторов
        time_factor = 1.0
        if 9 <= hour < 18:  # Рабочие часы
            time_factor = 1.5
        elif 0 <= hour < 6:  # Ночное время
            time_factor = 0.6
        
        # Добавление недельного фактора
        week_factor = day_of_week_factors[day_of_week]
        
        # Добавление месячного фактора
        month_factor = month_factors[month]
        
        # Комбинированный фактор
        combined_factor = time_factor * week_factor * month_factor
        
        # Проверка на плановые события
        event_factor = 1.0
        event_type = None
        for event_start, event_end, event_name in planned_events:
            if event_start <= current_date < event_end:
                if event_name == 'backup':
                    event_factor = 1.5  # Повышенная нагрузка на диск
                    event_type = 'backup'
                elif event_name == 'update':
                    event_factor = 0.5  # Пониженная активность пользователей
                    event_type = 'update'
                elif event_name == 'maintenance':
                    event_factor = 0.3  # Значительно пониженная активность
                    event_type = 'maintenance'
                break
        
        # Проверка на инциденты
        incident_factor = 1.0
        for incident_start, incident_end, _ in incidents:
            if incident_start <= current_date < incident_end:
                incident_factor = random.uniform(1.5, 3.0)  # Значительное увеличение нагрузки
                event_type = 'incident'
                break
        
        # Создание аномалий (помимо инцидентов)
        anomaly = False
        anomaly_factor = 1.0
        if event_type != 'incident' and random.random() < 0.01:  # 1% шанс аномалии
            anomaly = True
            anomaly_factor = random.uniform(1.5, 2.5)
            event_type = 'anomaly'
            
        # Генерация значений с шумом
        base_cpu = server_config['cpu_base']
        base_memory = server_config['mem_base']
        base_network = server_config['net_base']
        
        # Обновление значения диска с учетом времени
        servers[server]['disk'] += random.uniform(0, 0.05)  # Медленный рост использования диска
        if event_type == 'backup':
            servers[server]['disk'] -= random.uniform(0, 0.5)  # Уменьшение после бэкапа
        servers[server]['disk'] = min(95, max(30, servers[server]['disk']))
        
        # Генерация значений метрик
        cpu = min(95, max(10, np.random.normal(base_cpu * combined_factor, 5) * event_factor * incident_factor * anomaly_factor))
        memory = min(95, max(20, np.random.normal(base_memory * combined_factor, 8) * event_factor * incident_factor * anomaly_factor))
        disk = servers[server]['disk']
        network = max(100, np.random.normal(base_network * combined_factor, 300) * event_factor * incident_factor * anomaly_factor)
        
        # Время отклика зависит от нагрузки CPU и памяти
        resp_time = max(50, (cpu * 0.5 + memory * 0.3) * random.uniform(0.8, 1.2) * event_factor * incident_factor * anomaly_factor)
        
        # Активные пользователи
        users = max(1, int(np.random.normal(20 * combined_factor, 5) * event_factor))
        if event_type == 'update' or event_type == 'maintenance':
            users = max(1, users // 2)  # Меньше пользователей во время обновлений
        
        # Ошибки чаще при инцидентах и аномалиях
        errors = 0
        if event_type == 'incident':
            errors = random.randint(3, 20)
        elif event_type == 'anomaly':
            errors = random.randint(1, 10)
        elif random.random() < 0.03:  # 3% шанс случайных ошибок
            errors = random.randint(1, 3)
        
        timestamps.append(current_date)
        cpu_usage.append(round(cpu, 1))
        memory_usage.append(round(memory, 1))
        disk_usage.append(round(disk, 1))
        network_traffic.append(int(network))
        response_time.append(int(resp_time))
        active_users.append(users)
        error_count.append(errors)
        server_id.append(server)
        
        current_date += timedelta(minutes=interval_minutes)
    
    # Создание DataFrame
    df = pd.DataFrame({
        'timestamp': timestamps,
        'server_id': server_id,
        'cpu_usage': cpu_usage,
        'memory_usage': memory_usage,
        'disk_usage': disk_usage,
        'network_traffic': network_traffic,
        'response_time': response_time,
        'active_users': active_users,
        'error_count': error_count
    })
    
    print(f"Сгенерировано {len(df)} записей метрик сервера")
    return df

# Функция для генерации логов инцидентов на основе метрик сервера
def generate_incident_logs(server_metrics, threshold=0.7):
    print("Генерация логов инцидентов...")
    incidents = []
    
    # Типы сервисов
    services = ['api', 'database', 'web', 'auth', 'storage', 'cache', 'messaging', 'payment', 'notification']
    
    # Сообщения об ошибках
    error_messages = {
        'api': [
            'API rate limit exceeded', 
            'API endpoint timeout', 
            'Invalid API response',
            'API gateway error',
            'API version mismatch',
            'API authentication failed'
        ],
        'database': [
            'Connection timeout', 
            'Query execution error', 
            'Deadlock detected',
            'Database connection pool exhausted',
            'Slow query performance',
            'Database replication lag',
            'Index corruption detected'
        ],
        'web': [
            'Page load timeout', 
            'Static asset not found', 
            'Template rendering error',
            'CSS compilation failed',
            'JavaScript error',
            'CORS policy violation',
            'Content security policy violation'
        ],
        'auth': [
            'Authentication failed', 
            'Token expired', 
            'Permission denied',
            'OAuth provider unavailable',
            'Two-factor authentication failed',
            'Session validation error',
            'User directory service unavailable'
        ],
        'storage': [
            'Storage limit reached', 
            'File not found', 
            'Corrupted data',
            'Storage I/O performance degradation',
            'Blob storage connection error',
            'File system permission denied',
            'Storage quota exceeded'
        ],
        'cache': [
            'Cache miss', 
            'Cache invalidation error', 
            'Cache overflow',
            'Cache eviction rate high',
            'Cache server connection refused',
            'Cache consistency error',
            'Cache hit ratio low'
        ],
        'messaging': [
            'Message queue full',
            'Message processing timeout',
            'Dead letter queue overflow',
            'Message broker connection lost',
            'Topic subscription error',
            'Message serialization failed'
        ],
        'payment': [
            'Payment gateway timeout',
            'Transaction declined',
            'Payment provider API error',
            'Fraud detection alert',
            'Currency conversion error',
            'Payment reconciliation failed'
        ],
        'notification': [
            'Notification delivery failed',
            'Push notification service unavailable',
            'Email sending rate limited',
            'SMS gateway error',
            'Notification template error',
            'Notification channel not configured'
        ]
    }
    
    # Сбрасываем индекс, чтобы timestamp был доступен как колонка
    server_metrics_reset = server_metrics.reset_index()
    
    # Генерация инцидентов на основе аномалий в метриках
    high_cpu = server_metrics_reset[server_metrics_reset['cpu_usage'] > 80]
    high_memory = server_metrics_reset[server_metrics_reset['memory_usage'] > 85]
    high_response = server_metrics_reset[server_metrics_reset['response_time'] > 300]
    error_events = server_metrics_reset[server_metrics_reset['error_count'] > 0]
    
    # Функция для создания инцидента
    def create_incident(timestamp, server, service, is_error=False):
        severity = "error" if is_error else "warning"
        message = random.choice(error_messages[service])
        response_time = random.randint(300, 1000) if is_error else random.randint(200, 500)
        status_code = 500 if is_error else 200
        
        # Добавление дополнительных полей для более богатых логов
        request_id = f"req-{random.randint(100000, 999999)}"
        user_id = f"user-{random.randint(1000, 9999)}" if random.random() > 0.3 else None
        client_ip = f"192.168.{random.randint(1, 254)}.{random.randint(1, 254)}"
        
        return {
            "timestamp": timestamp.strftime("%Y-%m-%dT%H:%M:%S"),
            "server_id": server,
            "service": service,
            "severity": severity,
            "message": message,
            "response_time": response_time if not is_error or random.random() > 0.3 else None,
            "status_code": status_code,
            "request_id": request_id,
            "user_id": user_id,
            "client_ip": client_ip
        }
    
    # Создание инцидентов для высокой загрузки CPU
    for _, row in high_cpu.sample(frac=threshold).iterrows():
        service = random.choice(['api', 'database', 'web'])
        incidents.append(create_incident(row['timestamp'], row['server_id'], service))
    
    # Создание инцидентов для высокой загрузки памяти
    for _, row in high_memory.sample(frac=threshold).iterrows():
        service = random.choice(['database', 'cache', 'web'])
        incidents.append(create_incident(row['timestamp'], row['server_id'], service))
    
    # Создание инцидентов для высокого времени отклика
    for _, row in high_response.sample(frac=threshold).iterrows():
        service = random.choice(['api', 'web', 'database', 'payment'])
        incidents.append(create_incident(row['timestamp'], row['server_id'], service))
    
    # Создание инцидентов для ошибок
    for _, row in error_events.iterrows():
        if row['error_count'] > 0:
            for _ in range(min(5, row['error_count'])):
                service = random.choice(services)
                incidents.append(create_incident(row['timestamp'], row['server_id'], service, True))
    
    print(f"Сгенерировано {len(incidents)} записей логов инцидентов")
    return incidents

# Функция для генерации метрик качества
def generate_quality_metrics(start_date, days=90):
    print(f"Генерация метрик качества за {days} дней...")
    dates = []
    uptime = []
    mttr = []
    mtbf = []
    error_rate = []
    satisfaction = []
    sla_compliance = []
    
    current_date = start_date
    end_date = start_date + timedelta(days=days)
    
    # Создание трендов для метрик качества
    # Базовые значения, которые будут изменяться со временем
    base_values = {
        'uptime': 99.9,       # Начальное значение uptime
        'mttr': 15.0,         # Начальное значение MTTR
        'mtbf': 2160.0,       # Начальное значение MTBF (36 часов в минутах)
        'error_rate': 0.05,   # Начальное значение error_rate
        'satisfaction': 4.8,  # Начальное значение удовлетворенности
        'sla': 98.5           # Начальное значение соответствия SLA
    }
    
    # Тренды (изменения за день)
    trends = {
        'uptime': 0.0,        # Стабильный
        'mttr': -0.02,        # Улучшение (уменьшение времени восстановления)
        'mtbf': 1.0,          # Улучшение (увеличение времени между сбоями)
        'error_rate': -0.0001, # Улучшение (уменьшение частоты ошибок)
        'satisfaction': 0.001, # Медленное улучшение удовлетворенности
        'sla': 0.01           # Медленное улучшение соответствия SLA
    }
    
    # Создание "событий" - дней с отклонениями от нормы
    events = []
    for _ in range(5):  # 5 случайных событий
        event_date = start_date + timedelta(days=random.randint(0, days-1))
        event_duration = random.randint(1, 3)  # Длительность события в днях
        event_severity = random.uniform(0.5, 2.0)  # Коэффициент влияния на метрики
        events.append((event_date, event_date + timedelta(days=event_duration), event_severity))
    
    while current_date < end_date:
        # Применение трендов
        for metric, trend in trends.items():
            base_values[metric] += trend
        
        # Проверка на наличие событий
        event_factor = 1.0
        for event_start, event_end, severity in events:
            if event_start <= current_date < event_end:
                event_factor = severity
                break
        
        # Добавление случайных вариаций
        day_uptime = max(95, min(100, base_values['uptime'] + random.uniform(-0.3, 0.1) * event_factor))
        day_mttr = max(5, base_values['mttr'] + random.uniform(-5, 10) * event_factor)
        day_mtbf = max(1200, base_values['mtbf'] + random.uniform(-300, 300) / event_factor)
        day_error = max(0, min(1, base_values['error_rate'] + random.uniform(-0.03, 0.15) * event_factor))
        day_satisfaction = max(1, min(5, base_values['satisfaction'] + random.uniform(-0.3, 0.2) / event_factor))
        day_sla = max(90, min(100, base_values['sla'] + random.uniform(-3, 1.5) / event_factor))
        
        # Добавление зависимостей между метриками
        if day_uptime < 99.5:
            day_satisfaction -= random.uniform(0.2, 0.5)
            day_sla -= random.uniform(2, 5)
        
        if day_error > 0.1:
            day_satisfaction -= random.uniform(0.1, 0.4)
            day_sla -= random.uniform(1, 3)
        
        dates.append(current_date)
        uptime.append(round(day_uptime, 2))
        mttr.append(round(day_mttr, 1))
        mtbf.append(round(day_mtbf, 1))
        error_rate.append(round(day_error, 2))
        satisfaction.append(round(day_satisfaction, 1))
        sla_compliance.append(round(day_sla, 1))
        
        current_date += timedelta(days=1)
    
    # Создание DataFrame
    df = pd.DataFrame({
        'date': dates,
        'service_uptime': uptime,
        'mttr': mttr,
        'mtbf': mtbf,
        'error_rate': error_rate,
        'user_satisfaction': satisfaction,
        'sla_compliance': sla_compliance
    })
    
    print(f"Сгенерировано {len(df)} записей метрик качества")
    return df

# Генерация данных
print("Начало генерации данных...")
start_date = datetime(2025, 2, 23)  # Начало с 23 февраля 2025
server_metrics = generate_server_metrics(start_date, days=90, interval_minutes=5)
incident_logs = generate_incident_logs(server_metrics)
quality_metrics = generate_quality_metrics(start_date, days=90)

# Сохранение данных
print("Сохранение данных...")
server_metrics.to_csv('data/server_metrics.csv', index=False)
with open('data/incident_logs.json', 'w') as f:
    json.dump(incident_logs, f, indent=2)
quality_metrics.to_csv('data/quality_metrics.csv', index=False)

print("\nГенерация данных завершена!")
print(f"Сгенерировано {len(server_metrics)} записей метрик сервера")
print(f"Сгенерировано {len(incident_logs)} записей логов инцидентов")
print(f"Сгенерировано {len(quality_metrics)} записей метрик качества")
print("\nФайлы сохранены в директории 'data/'") 