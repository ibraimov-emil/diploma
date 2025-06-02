import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import json
from datetime import datetime, timedelta
import os
from sklearn.ensemble import IsolationForest, RandomForestRegressor
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split, TimeSeriesSplit
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
from sklearn.linear_model import LinearRegression
from statsmodels.tsa.arima.model import ARIMA
import warnings
from sklearn.cluster import KMeans
from sklearn.decomposition import PCA

# Создание директории для результатов
if not os.path.exists('results'):
    os.makedirs('results')

# Настройка стиля графиков
plt.style.use('seaborn-v0_8-whitegrid')
sns.set(font_scale=1.2)
warnings.filterwarnings('ignore')

# 1. Загрузка данных
print("Загрузка данных...")

# Загрузка метрик сервера
server_metrics = pd.read_csv('data/server_metrics.csv')
server_metrics['timestamp'] = pd.to_datetime(server_metrics['timestamp'])
server_metrics.set_index('timestamp', inplace=True)

# Загрузка логов инцидентов
with open('data/incident_logs.json', 'r') as f:
    incident_logs = json.load(f)
incident_df = pd.DataFrame(incident_logs)
incident_df['timestamp'] = pd.to_datetime(incident_df['timestamp'])
incident_df.set_index('timestamp', inplace=True)

# Загрузка метрик качества
quality_metrics = pd.read_csv('data/quality_metrics.csv')
quality_metrics['date'] = pd.to_datetime(quality_metrics['date'])
quality_metrics.set_index('date', inplace=True)

print(f"Загружено {len(server_metrics)} записей метрик сервера")
print(f"Загружено {len(incident_df)} записей логов инцидентов")
print(f"Загружено {len(quality_metrics)} записей метрик качества")

# 2. Исследовательский анализ данных
print("\nИсследовательский анализ данных...")

# Статистика по метрикам сервера
print("\nСтатистика по метрикам сервера:")
server_stats = server_metrics.describe()
print(server_stats)

# Сохранение статистики
server_stats.to_csv('results/server_metrics_stats.csv')

# Корреляционный анализ
plt.figure(figsize=(12, 10))
correlation = server_metrics.select_dtypes(include=[np.number]).corr()
sns.heatmap(correlation, annot=True, cmap='coolwarm', fmt='.2f')
plt.title('Корреляционная матрица метрик сервера')
plt.tight_layout()
plt.savefig('results/correlation_matrix.png')

# Визуализация метрик сервера во времени
plt.figure(figsize=(16, 14))

plt.subplot(4, 1, 1)
for server in server_metrics['server_id'].unique():
    server_data = server_metrics[server_metrics['server_id'] == server]
    plt.plot(server_data.index, server_data['cpu_usage'], label=f'CPU {server}')
plt.title('CPU Usage Over Time')
plt.legend()

plt.subplot(4, 1, 2)
for server in server_metrics['server_id'].unique():
    server_data = server_metrics[server_metrics['server_id'] == server]
    plt.plot(server_data.index, server_data['memory_usage'], label=f'Memory {server}')
plt.title('Memory Usage Over Time')
plt.legend()

plt.subplot(4, 1, 3)
for server in server_metrics['server_id'].unique():
    server_data = server_metrics[server_metrics['server_id'] == server]
    plt.plot(server_data.index, server_data['response_time'], label=f'Response {server}')
plt.title('Response Time Over Time')
plt.legend()

plt.subplot(4, 1, 4)
for server in server_metrics['server_id'].unique():
    server_data = server_metrics[server_metrics['server_id'] == server]
    plt.plot(server_data.index, server_data['error_count'], label=f'Errors {server}')
plt.title('Error Count Over Time')
plt.legend()

plt.tight_layout()
plt.savefig('results/metrics_over_time.png')

# Анализ распределения метрик
plt.figure(figsize=(16, 12))

plt.subplot(2, 3, 1)
sns.histplot(server_metrics['cpu_usage'], kde=True)
plt.title('CPU Usage Distribution')

plt.subplot(2, 3, 2)
sns.histplot(server_metrics['memory_usage'], kde=True)
plt.title('Memory Usage Distribution')

plt.subplot(2, 3, 3)
sns.histplot(server_metrics['response_time'], kde=True)
plt.title('Response Time Distribution')

plt.subplot(2, 3, 4)
sns.histplot(server_metrics['active_users'], kde=True)
plt.title('Active Users Distribution')

plt.subplot(2, 3, 5)
sns.histplot(server_metrics['error_count'], kde=True)
plt.title('Error Count Distribution')

plt.subplot(2, 3, 6)
sns.countplot(x='server_id', data=server_metrics.reset_index())
plt.title('Records per Server')

plt.tight_layout()
plt.savefig('results/metrics_distribution.png')

# Анализ инцидентов по сервисам
plt.figure(figsize=(12, 6))
sns.countplot(y='service', data=incident_df.reset_index(), order=incident_df['service'].value_counts().index)
plt.title('Incidents by Service')
plt.tight_layout()
plt.savefig('results/incidents_by_service.png')

# Анализ инцидентов по серверам
plt.figure(figsize=(10, 6))
sns.countplot(x='server_id', data=incident_df.reset_index())
plt.title('Incidents by Server')
plt.tight_layout()
plt.savefig('results/incidents_by_server.png')

# 3. Обнаружение аномалий в логах с помощью Isolation Forest
print("\nОбнаружение аномалий в логах...")

# Подготовка данных для обнаружения аномалий
anomaly_features = ['cpu_usage', 'memory_usage', 'response_time', 'error_count']
X = server_metrics[anomaly_features].copy()

# Нормализация данных
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Применение алгоритма Isolation Forest
model = IsolationForest(contamination=0.05, random_state=42)
server_metrics['anomaly'] = model.fit_predict(X_scaled)
server_metrics['anomaly'] = server_metrics['anomaly'].map({1: 0, -1: 1})  # 1 для аномалий, 0 для нормальных точек

# Визуализация обнаруженных аномалий
plt.figure(figsize=(14, 8))
plt.scatter(server_metrics.index, server_metrics['response_time'], 
            c=server_metrics['anomaly'], cmap='viridis', 
            s=50, alpha=0.7, edgecolors='k')
plt.colorbar(label='Anomaly')
plt.title('Обнаружение аномалий в Response Time')
plt.tight_layout()
plt.savefig('results/anomaly_detection.png')

# Анализ аномалий
anomalies = server_metrics[server_metrics['anomaly'] == 1]
print(f"\nОбнаружено {len(anomalies)} аномалий из {len(server_metrics)} записей ({len(anomalies)/len(server_metrics)*100:.2f}%)")
print("\nСтатистика по аномальным точкам:")
anomaly_stats = anomalies.describe()
print(anomaly_stats)
anomaly_stats.to_csv('results/anomaly_stats.csv')

# Визуализация распределения аномалий по времени суток
plt.figure(figsize=(12, 6))
anomalies['hour'] = anomalies.index.hour
normal = server_metrics[server_metrics['anomaly'] == 0]
normal['hour'] = normal.index.hour

plt.subplot(1, 2, 1)
sns.countplot(x='hour', data=anomalies.reset_index())
plt.title('Аномалии по часам')

plt.subplot(1, 2, 2)
sns.countplot(x='hour', data=normal.reset_index())
plt.title('Нормальные точки по часам')

plt.tight_layout()
plt.savefig('results/anomalies_by_hour.png')

# Визуализация аномалий в разных измерениях
plt.figure(figsize=(16, 12))

plt.subplot(2, 2, 1)
plt.scatter(server_metrics['cpu_usage'], server_metrics['memory_usage'], 
            c=server_metrics['anomaly'], cmap='viridis', 
            s=50, alpha=0.7, edgecolors='k')
plt.colorbar(label='Anomaly')
plt.xlabel('CPU Usage')
plt.ylabel('Memory Usage')
plt.title('CPU vs Memory Usage')

plt.subplot(2, 2, 2)
plt.scatter(server_metrics['cpu_usage'], server_metrics['response_time'], 
            c=server_metrics['anomaly'], cmap='viridis', 
            s=50, alpha=0.7, edgecolors='k')
plt.colorbar(label='Anomaly')
plt.xlabel('CPU Usage')
plt.ylabel('Response Time')
plt.title('CPU vs Response Time')

plt.subplot(2, 2, 3)
plt.scatter(server_metrics['memory_usage'], server_metrics['response_time'], 
            c=server_metrics['anomaly'], cmap='viridis', 
            s=50, alpha=0.7, edgecolors='k')
plt.colorbar(label='Anomaly')
plt.xlabel('Memory Usage')
plt.ylabel('Response Time')
plt.title('Memory vs Response Time')

plt.subplot(2, 2, 4)
plt.scatter(server_metrics['response_time'], server_metrics['error_count'], 
            c=server_metrics['anomaly'], cmap='viridis', 
            s=50, alpha=0.7, edgecolors='k')
plt.colorbar(label='Anomaly')
plt.xlabel('Response Time')
plt.ylabel('Error Count')
plt.title('Response Time vs Error Count')

plt.tight_layout()
plt.savefig('results/anomaly_dimensions.png')

# Применение PCA для визуализации аномалий в 2D
pca = PCA(n_components=2)
X_pca = pca.fit_transform(X_scaled)

plt.figure(figsize=(10, 8))
plt.scatter(X_pca[:, 0], X_pca[:, 1], c=server_metrics['anomaly'], cmap='viridis', 
            s=50, alpha=0.7, edgecolors='k')
plt.colorbar(label='Anomaly')
plt.xlabel('PC1')
plt.ylabel('PC2')
plt.title('PCA визуализация аномалий')
plt.tight_layout()
plt.savefig('results/anomaly_pca.png')

# 4. Прогнозирование нагрузки на сервер
print("\nПрогнозирование нагрузки на сервер...")

# Выбор одного сервера для прогнозирования
server_id = 'srv1'
server_data = server_metrics[server_metrics['server_id'] == server_id].copy()

# Ресемплинг по часам для сглаживания
hourly_cpu = server_data['cpu_usage'].resample('1H').mean()
hourly_cpu = hourly_cpu.fillna(method='ffill')

# Создание признаков для прогнозирования (лаги)
def create_features(data, lag=3):
    df = pd.DataFrame(data)
    df.columns = ['y']
    
    # Добавление временных признаков
    df['hour'] = df.index.hour
    df['dayofweek'] = df.index.dayofweek
    df['month'] = df.index.month
    df['day'] = df.index.day
    
    # Добавление лагов
    for i in range(1, lag+1):
        df[f'lag_{i}'] = df['y'].shift(i)
    
    df.dropna(inplace=True)
    return df

# Подготовка данных с лагами
cpu_data = create_features(hourly_cpu, lag=24)  # Используем данные за предыдущие 24 часа

# Разделение на обучающую и тестовую выборки (временной ряд)
train_size = int(len(cpu_data) * 0.8)
train = cpu_data[:train_size]
test = cpu_data[train_size:]

# Разделение на признаки и целевую переменную
X_train = train.drop('y', axis=1)
y_train = train['y']
X_test = test.drop('y', axis=1)
y_test = test['y']

# Обучение модели Random Forest
rf_model = RandomForestRegressor(n_estimators=100, random_state=42)
rf_model.fit(X_train, y_train)

# Прогнозирование
y_pred_rf = rf_model.predict(X_test)

# Оценка модели
mse = mean_squared_error(y_test, y_pred_rf)
mae = mean_absolute_error(y_test, y_pred_rf)
r2 = r2_score(y_test, y_pred_rf)
print(f"\nРезультаты прогнозирования Random Forest:")
print(f"Mean Squared Error: {mse:.4f}")
print(f"Mean Absolute Error: {mae:.4f}")
print(f"R² Score: {r2:.4f}")

# Визуализация прогнозов
plt.figure(figsize=(14, 7))
plt.plot(y_test.index, y_test.values, 'b-', label='Actual')
plt.plot(y_test.index, y_pred_rf, 'r--', label='Predicted')
plt.title(f'Прогнозирование нагрузки CPU для {server_id}')
plt.xlabel('Дата')
plt.ylabel('CPU Usage (%)')
plt.legend()
plt.tight_layout()
plt.savefig('results/cpu_prediction.png')

# Важность признаков
feature_importance = pd.DataFrame({
    'Feature': X_train.columns,
    'Importance': rf_model.feature_importances_
}).sort_values('Importance', ascending=False)

plt.figure(figsize=(12, 6))
sns.barplot(x='Importance', y='Feature', data=feature_importance)
plt.title('Важность признаков для прогнозирования нагрузки CPU')
plt.tight_layout()
plt.savefig('results/feature_importance.png')

# 5. Прогнозирование временных рядов с помощью ARIMA
print("\nПрогнозирование временных рядов с помощью ARIMA...")

# Подготовка данных для ARIMA (только CPU)
try:
    # Используем меньший набор данных для ускорения вычислений
    arima_data = hourly_cpu[-200:]
    train_size = int(len(arima_data) * 0.8)
    arima_train = arima_data[:train_size]
    arima_test = arima_data[train_size:]
    
    # Обучение модели ARIMA
    arima_model = ARIMA(arima_train, order=(5,1,0))
    arima_model_fit = arima_model.fit()
    
    # Прогнозирование
    forecast_steps = len(arima_test)
    arima_forecast = arima_model_fit.forecast(steps=forecast_steps)
    
    # Оценка модели
    arima_mse = mean_squared_error(arima_test, arima_forecast)
    arima_mae = mean_absolute_error(arima_test, arima_forecast)
    print(f"\nРезультаты прогнозирования ARIMA:")
    print(f"Mean Squared Error: {arima_mse:.4f}")
    print(f"Mean Absolute Error: {arima_mae:.4f}")
    
    # Визуализация прогнозов ARIMA
    plt.figure(figsize=(14, 7))
    plt.plot(arima_test.index, arima_test.values, 'b-', label='Actual')
    plt.plot(arima_test.index, arima_forecast, 'g--', label='ARIMA Forecast')
    plt.title('Прогнозирование нагрузки на CPU с помощью ARIMA')
    plt.legend()
    plt.tight_layout()
    plt.savefig('results/arima_forecast.png')
except Exception as e:
    print(f"Не удалось выполнить прогнозирование с помощью ARIMA: {e}")

# 6. Анализ взаимосвязи между метриками качества и производительностью сервера
print("\nАнализ взаимосвязи между метриками качества и производительностью сервера...")

# Агрегация метрик сервера по дням для соответствия метрикам качества
# Исключаем строковый столбец server_id из агрегации
numeric_columns = server_metrics.select_dtypes(include=[np.number]).columns
server_daily = server_metrics[numeric_columns].resample('D').mean()

# Объединение данных по дате
merged_data = pd.merge(server_daily, quality_metrics, left_index=True, right_index=True, how='inner')

# Корреляционный анализ
plt.figure(figsize=(14, 12))
merged_corr = merged_data.select_dtypes(include=[np.number]).corr()
sns.heatmap(merged_corr, annot=True, cmap='coolwarm', fmt='.2f')
plt.title('Корреляция между метриками сервера и показателями качества')
plt.tight_layout()
plt.savefig('results/quality_performance_correlation.png')

# Анализ влияния нагрузки на качество обслуживания
plt.figure(figsize=(14, 10))
plt.subplot(2, 2, 1)
plt.scatter(merged_data['cpu_usage'], merged_data['service_uptime'])
plt.title('CPU Usage vs Service Uptime')
plt.xlabel('CPU Usage (%)')
plt.ylabel('Service Uptime (%)')

plt.subplot(2, 2, 2)
plt.scatter(merged_data['response_time'], merged_data['user_satisfaction'])
plt.title('Response Time vs User Satisfaction')
plt.xlabel('Response Time (ms)')
plt.ylabel('User Satisfaction (1-5)')

plt.subplot(2, 2, 3)
plt.scatter(merged_data['error_count'], merged_data['error_rate'])
plt.title('Error Count vs Error Rate')
plt.xlabel('Error Count')
plt.ylabel('Error Rate (%)')

plt.subplot(2, 2, 4)
plt.scatter(merged_data['memory_usage'], merged_data['mttr'])
plt.title('Memory Usage vs MTTR')
plt.xlabel('Memory Usage (%)')
plt.ylabel('Mean Time to Recovery (min)')

plt.tight_layout()
plt.savefig('results/quality_vs_performance.png')

# Регрессионный анализ для предсказания удовлетворенности пользователей
print("\nРегрессионный анализ для предсказания удовлетворенности пользователей...")

# Подготовка данных
X = merged_data[['cpu_usage', 'memory_usage', 'response_time', 'error_count']]
y = merged_data['user_satisfaction']

# Разделение на обучающую и тестовую выборки
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Обучение модели линейной регрессии
satisfaction_model = LinearRegression()
satisfaction_model.fit(X_train, y_train)

# Прогнозирование
y_pred = satisfaction_model.predict(X_test)

# Оценка модели
sat_mse = mean_squared_error(y_test, y_pred)
sat_mae = mean_absolute_error(y_test, y_pred)
sat_r2 = r2_score(y_test, y_pred)

print(f"Результаты предсказания удовлетворенности пользователей:")
print(f"Mean Squared Error: {sat_mse:.4f}")
print(f"Mean Absolute Error: {sat_mae:.4f}")
print(f"R² Score: {sat_r2:.4f}")

# Коэффициенты модели
coef_df = pd.DataFrame({
    'Feature': X.columns,
    'Coefficient': satisfaction_model.coef_
})
print("\nКоэффициенты модели предсказания удовлетворенности:")
print(coef_df)

# Визуализация фактических и предсказанных значений
plt.figure(figsize=(10, 6))
plt.scatter(y_test, y_pred)
plt.plot([y_test.min(), y_test.max()], [y_test.min(), y_test.max()], 'k--')
plt.xlabel('Фактическая удовлетворенность')
plt.ylabel('Предсказанная удовлетворенность')
plt.title('Сравнение фактической и предсказанной удовлетворенности пользователей')
plt.tight_layout()
plt.savefig('results/satisfaction_prediction.png')

# 7. Кластеризация серверов по характеристикам
print("\nКластеризация серверов по характеристикам...")

# Агрегация данных по серверам
server_profiles = server_metrics.groupby('server_id').agg({
    'cpu_usage': ['mean', 'std', 'max'],
    'memory_usage': ['mean', 'std', 'max'],
    'response_time': ['mean', 'std', 'max'],
    'error_count': ['mean', 'sum'],
    'active_users': ['mean', 'max']
})

# Сглаживание столбцов
server_profiles.columns = ['_'.join(col).strip() for col in server_profiles.columns.values]

# Нормализация данных для кластеризации
scaler = StandardScaler()
server_profiles_scaled = scaler.fit_transform(server_profiles)

# Применение K-means
kmeans = KMeans(n_clusters=3, random_state=42)
clusters = kmeans.fit_predict(server_profiles_scaled)

# Добавление кластеров к профилям серверов
server_profiles['cluster'] = clusters

# Визуализация кластеров с помощью PCA
pca = PCA(n_components=2)
server_profiles_pca = pca.fit_transform(server_profiles_scaled)

plt.figure(figsize=(10, 8))
plt.scatter(server_profiles_pca[:, 0], server_profiles_pca[:, 1], c=clusters, cmap='viridis', 
            s=100, alpha=0.8, edgecolors='k')

# Добавление меток серверов
for i, server in enumerate(server_profiles.index):
    plt.annotate(server, (server_profiles_pca[i, 0], server_profiles_pca[i, 1]),
                 fontsize=12, ha='center', va='center')

plt.title('Кластеризация серверов по характеристикам')
plt.xlabel('PC1')
plt.ylabel('PC2')
plt.tight_layout()
plt.savefig('results/server_clustering.png')

# Характеристики кластеров
cluster_stats = server_profiles.groupby('cluster').mean()
print("\nХарактеристики кластеров серверов:")
print(cluster_stats)
cluster_stats.to_csv('results/cluster_stats.csv')

print("\nАнализ завершен. Результаты сохранены в директории 'results/'") 