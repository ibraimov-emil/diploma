import { Injectable } from '@nestjs/common';
import * as client from 'prom-client';

@Injectable()
export class PrometheusService {
    private readonly registry: client.Registry;
    private readonly gauges: Map<string, client.Gauge>;

    constructor() {
        this.registry = new client.Registry();
        this.gauges = new Map();
    }

    createGauge(name: string, help: string): void {
        const gauge = new client.Gauge({
            name: name,
            help: help,
            registers: [this.registry]
        });
        this.gauges.set(name, gauge);
    }

    updateGauge(name: string, value: number): void {
        const gauge = this.gauges.get(name);
        if (gauge) {
            gauge.set(value);
        }
    }

    async getMetrics(): Promise<string> {
        return await this.registry.metrics();
    }
} 