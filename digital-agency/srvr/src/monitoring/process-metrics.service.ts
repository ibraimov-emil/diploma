import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PrometheusService } from '../prometheus/prometheus.service';
import { RequestToProjectTracking } from './entities/request-to-project-tracking.entity';
import { ChatResponseTracking } from './entities/chat-response-tracking.entity';
import { InvoicePaymentTracking } from './entities/invoice-payment-tracking.entity';
import { TaskCompletionTracking } from './entities/task-completion-tracking.entity';
import { SLADefinitions } from './entities/sla-definitions.entity';

@Injectable()
export class ProcessMetricsService {
    constructor(
        @InjectRepository(RequestToProjectTracking)
        private requestTrackingRepo: Repository<RequestToProjectTracking>,
        @InjectRepository(ChatResponseTracking)
        private chatTrackingRepo: Repository<ChatResponseTracking>,
        @InjectRepository(InvoicePaymentTracking)
        private invoiceTrackingRepo: Repository<InvoicePaymentTracking>,
        @InjectRepository(TaskCompletionTracking)
        private taskTrackingRepo: Repository<TaskCompletionTracking>,
        @InjectRepository(SLADefinitions)
        private slaDefinitionsRepo: Repository<SLADefinitions>,
        private prometheusService: PrometheusService
    ) {
        this.initializeMetrics();
    }

    private async initializeMetrics() {
        // Initialize Prometheus metrics
        this.prometheusService.registerGauge('request_to_project_time_seconds', 'Time to convert request to project');
        this.prometheusService.registerGauge('chat_response_time_seconds', 'Time to respond to chat messages');
        this.prometheusService.registerGauge('invoice_payment_time_seconds', 'Time from invoice to payment');
        this.prometheusService.registerGauge('task_completion_rate', 'Percentage of tasks completed on time');
    }

    async trackRequestToProject(requestId: number, projectId: number, requestCreatedAt: Date, projectCreatedAt: Date) {
        const conversionTimeSeconds = Math.floor((projectCreatedAt.getTime() - requestCreatedAt.getTime()) / 1000);
        
        await this.requestTrackingRepo.save({
            request_id: requestId,
            project_id: projectId,
            request_created_at: requestCreatedAt,
            project_created_at: projectCreatedAt,
            conversion_time_seconds: conversionTimeSeconds
        });

        // Update Prometheus metric
        this.prometheusService.setGauge('request_to_project_time_seconds', conversionTimeSeconds);
    }

    async trackChatResponse(chatId: number, messageId: number, senderId: number, employeeId: number, 
                          messageSentAt: Date, responseSentAt: Date) {
        const responseTimeSeconds = Math.floor((responseSentAt.getTime() - messageSentAt.getTime()) / 1000);
        
        await this.chatTrackingRepo.save({
            chat_id: chatId,
            message_id: messageId,
            sender_id: senderId,
            employee_id: employeeId,
            message_sent_at: messageSentAt,
            response_sent_at: responseSentAt,
            response_time_seconds: responseTimeSeconds
        });

        // Update Prometheus metric
        this.prometheusService.setGauge('chat_response_time_seconds', responseTimeSeconds);
    }

    async trackInvoicePayment(invoiceId: number, projectId: number, invoiceCreatedAt: Date, paymentReceivedAt: Date) {
        const paymentTimeSeconds = Math.floor((paymentReceivedAt.getTime() - invoiceCreatedAt.getTime()) / 1000);
        
        await this.invoiceTrackingRepo.save({
            invoice_id: invoiceId,
            project_id: projectId,
            invoice_created_at: invoiceCreatedAt,
            payment_received_at: paymentReceivedAt,
            payment_time_seconds: paymentTimeSeconds
        });

        // Update Prometheus metric
        this.prometheusService.setGauge('invoice_payment_time_seconds', paymentTimeSeconds);
    }

    async trackTaskCompletion(taskId: number, projectId: number, dueDate: Date, completedAt: Date) {
        const completedOnTime = completedAt <= dueDate;
        
        await this.taskTrackingRepo.save({
            task_id: taskId,
            project_id: projectId,
            due_date: dueDate,
            completed_at: completedAt,
            completed_on_time: completedOnTime
        });

        // Calculate and update task completion rate
        const totalTasks = await this.taskTrackingRepo.count();
        const completedTasks = await this.taskTrackingRepo.count({ where: { completed_on_time: true } });
        const completionRate = totalTasks > 0 ? completedTasks / totalTasks : 0;

        // Update Prometheus metric
        this.prometheusService.setGauge('task_completion_rate', completionRate);
    }

    async getSLACompliance(metricName: string): Promise<{ current: number; target: number; compliant: boolean }> {
        console.log(`Getting SLA compliance for metric: ${metricName}`);
        
        try {
            const sla = await this.slaDefinitionsRepo.findOne({ where: { metric_name: metricName } });
            console.log('SLA definition found:', sla);
            
            if (!sla) {
                console.error(`SLA definition not found for metric: ${metricName}`);
                return { current: 0, target: 0, compliant: false };
            }

            let currentValue: number = 0;
            
            try {
                switch (metricName) {
                    case 'request_to_project_time':
                        console.log('Calculating request to project time metric');
                        const avgRequestTime = await this.requestTrackingRepo
                            .createQueryBuilder('tracking')
                            .select('AVG(conversion_time_seconds)', 'avg')
                            .getRawOne();
                        console.log('Avg request time:', avgRequestTime);
                        currentValue = avgRequestTime?.avg ? Number(avgRequestTime.avg) : 0;
                        break;
                    case 'chat_response_time':
                        console.log('Calculating chat response time metric');
                        const avgResponseTime = await this.chatTrackingRepo
                            .createQueryBuilder('tracking')
                            .select('AVG(response_time_seconds)', 'avg')
                            .getRawOne();
                        console.log('Avg response time:', avgResponseTime);
                        currentValue = avgResponseTime?.avg ? Number(avgResponseTime.avg) : 0;
                        break;
                    case 'invoice_payment_time':
                        console.log('Calculating invoice payment time metric');
                        const avgPaymentTime = await this.invoiceTrackingRepo
                            .createQueryBuilder('tracking')
                            .select('AVG(payment_time_seconds)', 'avg')
                            .getRawOne();
                        console.log('Avg payment time:', avgPaymentTime);
                        currentValue = avgPaymentTime?.avg ? Number(avgPaymentTime.avg) : 0;
                        break;
                    case 'task_completion_rate':
                        console.log('Calculating task completion rate metric');
                        const totalTasks = await this.taskTrackingRepo.count();
                        const completedTasks = await this.taskTrackingRepo.count({ where: { completed_on_time: true } });
                        console.log(`Total tasks: ${totalTasks}, Completed on time: ${completedTasks}`);
                        currentValue = totalTasks > 0 ? completedTasks / totalTasks : 0;
                        break;
                    default:
                        console.error(`Unsupported metric: ${metricName}`);
                        return { current: 0, target: Number(sla.target_value), compliant: false };
                }
            } catch (error) {
                console.error(`Error calculating metric ${metricName}:`, error);
                currentValue = 0;
            }

            // Use type casting to ensure numbers
            const targetValue = Number(sla.target_value);
            const isCompliant = metricName === 'task_completion_rate' 
                ? currentValue >= targetValue 
                : currentValue <= targetValue;
            
            const result = {
                current: currentValue,
                target: targetValue,
                compliant: isCompliant
            };
            
            console.log('Result:', result);
            return result;
        } catch (error) {
            console.error(`Error in getSLACompliance for ${metricName}:`, error);
            return { current: 0, target: 0, compliant: false };
        }
    }

    private async updateMetrics(metricName: string, value: number) {
        this.prometheusService.setGauge(metricName, value);
    }
} 