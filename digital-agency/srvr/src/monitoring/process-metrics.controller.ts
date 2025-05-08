import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ProcessMetricsService } from './process-metrics.service';

@Controller('metrics/process')
export class ProcessMetricsController {
    constructor(private readonly processMetricsService: ProcessMetricsService) {}

    @Get('request-to-project')
    async getRequestToProjectMetrics() {
        return this.processMetricsService.getSLACompliance('request_to_project_time');
    }

    @Get('chat-response')
    async getChatResponseMetrics() {
        return this.processMetricsService.getSLACompliance('chat_response_time');
    }

    @Get('invoice-payment')
    async getInvoicePaymentMetrics() {
        return this.processMetricsService.getSLACompliance('invoice_payment_time');
    }

    @Get('task-completion')
    async getTaskCompletionMetrics() {
        return this.processMetricsService.getSLACompliance('task_completion_rate');
    }

    @Post('track/request-to-project')
    async trackRequestToProject(
        @Body() data: { requestId: number; projectId: number; requestCreatedAt: Date; projectCreatedAt: Date }
    ) {
        return this.processMetricsService.trackRequestToProject(
            data.requestId,
            data.projectId,
            new Date(data.requestCreatedAt),
            new Date(data.projectCreatedAt)
        );
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
        return this.processMetricsService.trackChatResponse(
            data.chatId,
            data.messageId,
            data.senderId,
            data.employeeId,
            new Date(data.messageSentAt),
            new Date(data.responseSentAt)
        );
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
        return this.processMetricsService.trackInvoicePayment(
            data.invoiceId,
            data.projectId,
            new Date(data.invoiceCreatedAt),
            new Date(data.paymentReceivedAt)
        );
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
        return this.processMetricsService.trackTaskCompletion(
            data.taskId,
            data.projectId,
            new Date(data.dueDate),
            new Date(data.completedAt)
        );
    }
} 