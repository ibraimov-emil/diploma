import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProcessMetricsController } from './process-metrics.controller';
import { ProcessMetricsService } from './process-metrics.service';
import { PrometheusModule } from './prometheus.module';
import { RequestToProjectTracking } from './entities/request-to-project-tracking.entity';
import { ChatResponseTracking } from './entities/chat-response-tracking.entity';
import { InvoicePaymentTracking } from './entities/invoice-payment-tracking.entity';
import { TaskCompletionTracking } from './entities/task-completion-tracking.entity';
import { SLADefinitions } from './entities/sla-definitions.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            RequestToProjectTracking,
            ChatResponseTracking,
            InvoicePaymentTracking,
            TaskCompletionTracking,
            SLADefinitions
        ]),
        PrometheusModule
    ],
    controllers: [ProcessMetricsController],
    providers: [ProcessMetricsService],
    exports: [ProcessMetricsService]
})
export class ProcessMetricsModule {} 