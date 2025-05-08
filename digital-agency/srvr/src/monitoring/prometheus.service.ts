import { Injectable } from '@nestjs/common';
import * as client from 'prom-client';

@Injectable()
export class PrometheusService {
    private metrics = {};
    private registry: client.Registry;

    constructor() {
        this.registry = new client.Registry();
        this.registry.setDefaultLabels({
            app: 'digital-agency'
        });
    }

    createGauge(name: string, help: string) {
        const gauge = new client.Gauge({
            name,
            help,
            registers: [this.registry]
        });
        this.metrics[name] = gauge;
    }

    createCounter(name: string, help: string) {
        const counter = new client.Counter({
            name,
            help,
            registers: [this.registry]
        });
        this.metrics[name] = counter;
    }

    updateGauge(name: string, value: number) {
        if (this.metrics[name]) {
            this.metrics[name].set(value);
        }
    }

    incrementCounter(name: string, value: number = 1) {
        if (this.metrics[name]) {
            this.metrics[name].inc(value);
        }
    }

    createUserIncidentMetrics() {
        // Initialize incident metrics if they don't exist
        if (!this.metrics['user_reported_incidents_total']) {
            this.createCounter('user_reported_incidents_total', 'Total number of incidents reported by users');
        }
        
        if (!this.metrics['user_reported_incidents_by_severity']) {
            this.createCounter('user_reported_incidents_by_severity', 'User reported incidents by severity');
        }
        
        if (!this.metrics['user_reported_incidents_resolution_time']) {
            this.createGauge('user_reported_incidents_resolution_time', 'Average resolution time for user reported incidents (minutes)');
        }
    }

    getContentType() {
        return this.registry.contentType;
    }

    getMetrics() {
        return this.registry.metrics();
    }
} 