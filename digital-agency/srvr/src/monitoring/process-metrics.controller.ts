import { Controller, Get, Post, Body, Query, HttpException } from '@nestjs/common';
import { ProcessMetricsService } from './process-metrics.service';
import { PrometheusService } from '../prometheus/prometheus.service';

@Controller('metrics/process')
export class ProcessMetricsController {
    private errorCounter: number = 0;

    constructor(
        private readonly processMetricsService: ProcessMetricsService,
        private readonly prometheusService: PrometheusService
    ) {
        // Зарегистрируем метрику api_request_errors_total
        this.prometheusService.registerCounter('api_request_errors_total', 'Total number of API request errors', ['endpoint']);
    }

    @Get('request-to-project')
    async getRequestToProjectMetrics() {
        try {
            return this.processMetricsService.getSLACompliance('request_to_project_time');
        } catch (error) {
            this.prometheusService.incrementCounter('api_request_errors_total', { endpoint: 'request-to-project' });
            this.errorCounter++;
            throw error;
        }
    }

    @Get('chat-response')
    async getChatResponseMetrics() {
        try {
            return this.processMetricsService.getSLACompliance('chat_response_time');
        } catch (error) {
            this.prometheusService.incrementCounter('api_request_errors_total', { endpoint: 'chat-response' });
            this.errorCounter++;
            throw error;
        }
    }

    @Get('invoice-payment')
    async getInvoicePaymentMetrics() {
        try {
            return this.processMetricsService.getSLACompliance('invoice_payment_time');
        } catch (error) {
            this.prometheusService.incrementCounter('api_request_errors_total', { endpoint: 'invoice-payment' });
            this.errorCounter++;
            throw error;
        }
    }

    @Get('task-completion')
    async getTaskCompletionMetrics() {
        try {
            return this.processMetricsService.getSLACompliance('task_completion_rate');
        } catch (error) {
            this.prometheusService.incrementCounter('api_request_errors_total', { endpoint: 'task-completion' });
            this.errorCounter++;
            throw error;
        }
    }

    @Get('errors')
    getErrorCount() {
        return { errors: this.errorCounter };
    }

    @Post('track/request-to-project')
    async trackRequestToProject(
        @Body() data: { requestId: number; projectId: number; requestCreatedAt: Date; projectCreatedAt: Date }
    ) {
        try {
            return this.processMetricsService.trackRequestToProject(
                data.requestId,
                data.projectId,
                new Date(data.requestCreatedAt),
                new Date(data.projectCreatedAt)
            );
        } catch (error) {
            this.prometheusService.incrementCounter('api_request_errors_total', { endpoint: 'track-request-to-project' });
            this.errorCounter++;
            throw error;
        }
    }

    @Post('track/chat-response')
    async trackChatResponse(
        @Body() data: {
            chatId: number;
            messageId: number;
            senderId: number;
            employeeId: number;
            messageSentAt: Date;
            responseSentAt: Date;
        }
    ) {
        try {
            return this.processMetricsService.trackChatResponse(
                data.chatId,
                data.messageId,
                data.senderId,
                data.employeeId,
                new Date(data.messageSentAt),
                new Date(data.responseSentAt)
            );
        } catch (error) {
            this.prometheusService.incrementCounter('api_request_errors_total', { endpoint: 'track-chat-response' });
            this.errorCounter++;
            throw error;
        }
    }

    @Post('track/invoice-payment')
    async trackInvoicePayment(
        @Body() data: {
            invoiceId: number;
            projectId: number;
            invoiceCreatedAt: Date;
            paymentReceivedAt: Date;
        }
    ) {
        try {
            return this.processMetricsService.trackInvoicePayment(
                data.invoiceId,
                data.projectId,
                new Date(data.invoiceCreatedAt),
                new Date(data.paymentReceivedAt)
            );
        } catch (error) {
            this.prometheusService.incrementCounter('api_request_errors_total', { endpoint: 'track-invoice-payment' });
            this.errorCounter++;
            throw error;
        }
    }

    @Post('track/task-completion')
    async trackTaskCompletion(
        @Body() data: {
            taskId: number;
            projectId: number;
            dueDate: Date;
            completedAt: Date;
        }
    ) {
        try {
            return this.processMetricsService.trackTaskCompletion(
                data.taskId,
                data.projectId,
                new Date(data.dueDate),
                new Date(data.completedAt)
            );
        } catch (error) {
            this.prometheusService.incrementCounter('api_request_errors_total', { endpoint: 'track-task-completion' });
            this.errorCounter++;
            throw error;
        }
    }
} 