import { Injectable } from '@nestjs/common';
import * as client from 'prom-client';

@Injectable()
export class PrometheusService {
    private registry: client.Registry;
    private counters: Map<string, client.Counter<string>>;
    private gauges: Map<string, client.Gauge<string>>;
    private histograms: Map<string, client.Histogram<string>>;

    constructor() {
        this.registry = new client.Registry();
        this.counters = new Map();
        this.gauges = new Map();
        this.histograms = new Map();

        // Регистрация метрик по умолчанию
        client.collectDefaultMetrics({ register: this.registry });

        // Регистрация базовых метрик API
        this.registerResponseTimeHistogram();
        this.registerSystemUptime();
    }

    // Получить метрики для Prometheus
    getMetrics(): Promise<string> {
        return this.registry.metrics();
    }

    // Регистрация счетчика
    registerCounter(name: string, help: string, labels: string[] = []): void {
        const counter = new client.Counter({
            name,
            help,
            labelNames: labels,
            registers: [this.registry]
        });
        this.counters.set(name, counter);
    }

    // Увеличение счетчика
    incrementCounter(name: string, labels: Record<string, string> = {}, value: number = 1): void {
        const counter = this.counters.get(name);
        if (counter) {
            counter.inc(labels, value);
        }
    }

    // Регистрация измерителя
    registerGauge(name: string, help: string, labels: string[] = []): void {
        const gauge = new client.Gauge({
            name,
            help,
            labelNames: labels,
            registers: [this.registry]
        });
        this.gauges.set(name, gauge);
    }

    // Установка значения измерителя
    setGauge(name: string, value: number, labels: Record<string, string> = {}): void {
        const gauge = this.gauges.get(name);
        if (gauge) {
            gauge.set(labels, value);
        }
    }

    // Регистрация гистограммы
    registerHistogram(name: string, help: string, labels: string[] = [], buckets: number[] = []): void {
        const histogram = new client.Histogram({
            name,
            help,
            labelNames: labels,
            buckets: buckets.length > 0 ? buckets : client.exponentialBuckets(0.01, 1.5, 20),
            registers: [this.registry]
        });
        this.histograms.set(name, histogram);
    }

    // Запись времени в гистограмму
    observeHistogram(name: string, value: number, labels: Record<string, string> = {}): void {
        const histogram = this.histograms.get(name);
        if (histogram) {
            histogram.observe(labels, value);
        }
    }

    // Измерение времени выполнения функции
    startTimer(histogramName: string, labels: Record<string, string> = {}): () => void {
        const histogram = this.histograms.get(histogramName);
        if (histogram) {
            const end = histogram.startTimer(labels);
            return end;
        }
        return () => {};
    }

    // Регистрация гистограммы для времени ответа API
    private registerResponseTimeHistogram(): void {
        this.registerHistogram(
            'api_response_time_ms',
            'API response time in milliseconds',
            ['method', 'route', 'status_code']
        );
    }

    // Регистрация метрики аптайма системы
    private registerSystemUptime(): void {
        this.registerGauge(
            'system_uptime_percent',
            'System uptime percentage'
        );
        
        // Устанавливаем начальное значение 100%
        this.setGauge('system_uptime_percent', 100);
        
        // Обновление метрики каждую минуту
        setInterval(() => {
            // Имитация случайных колебаний доступности 99.5-100%
            const uptime = 99.5 + Math.random() * 0.5;
            this.setGauge('system_uptime_percent', uptime);
        }, 60000);
    }
} 