import os
import subprocess
import time

print("===== Запуск анализа метрик качества сервиса =====")

# Проверка наличия необходимых директорий
if not os.path.exists('data'):
    os.makedirs('data')
    print("Создана директория 'data/'")
    
if not os.path.exists('results'):
    os.makedirs('results')
    print("Создана директория 'results/'")

# Шаг 1: Генерация данных
print("\n1. Генерация набора данных...")
start_time = time.time()
subprocess.run(["python", "generate_dataset.py"])
gen_time = time.time() - start_time
print(f"Генерация данных завершена за {gen_time:.2f} секунд")

# Шаг 2: Анализ данных и применение машинного обучения
print("\n2. Анализ данных и применение методов машинного обучения...")
start_time = time.time()
subprocess.run(["python", "analyze_data.py"])
analysis_time = time.time() - start_time
print(f"Анализ данных завершен за {analysis_time:.2f} секунд")

print("\n===== Анализ завершен =====")
print("Результаты анализа сохранены в директории 'results/'")
print("Сгенерированные данные сохранены в директории 'data/'")
print("\nДля просмотра результатов откройте файлы изображений и CSV в директории 'results/'") 