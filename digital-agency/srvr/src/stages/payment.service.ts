import { Injectable, Logger } from '@nestjs/common';
import { YooKassa } from 'yookassa';
import { Stage } from './stage.model';
import {ICreatePayment, YooCheckout} from "@a2seven/yoo-checkout";
import {InjectModel} from "@nestjs/sequelize";
import {StagesService} from "./stage.service";

@Injectable()
export class PaymentService {
    private readonly yooKassa: YooCheckout;
    private readonly logger = new Logger(PaymentService.name);

    constructor() {
        // Initialize YooKassa with proper error handling
        try {
            this.yooKassa = new YooCheckout({ 
                shopId: process.env.YOOKASSA_SHOP_ID || "322548", 
                secretKey: process.env.YOOKASSA_SECRET_KEY || "test_d1VUB7y1Ips8Rgc9chVzN73kgHqe79ay1xag9AXtO2M" 
            });
        } catch (error) {
            this.logger.error('Failed to initialize YooKassa', error);
            throw error;
        }
    }

    async createPayment(stage: Stage) {
        try {
            this.logger.log(`Creating payment for stage ${stage.id}, stage data:`, JSON.stringify(stage));
            
            if (!stage.cost) {
                this.logger.error(`Stage ${stage.id} has no cost defined`);
                throw new Error('Stage cost is not defined');
            }

            // Ensure cost is properly formatted
            const cost = parseFloat(stage.cost.toString()).toFixed(2);
            this.logger.log(`Parsed cost for stage ${stage.id}: ${cost} (original: ${stage.cost})`);

            const createPayload: ICreatePayment = {
                amount: {
                    value: cost.toString(),
                    currency: 'RUB'
                },
                payment_method_data: {
                    type: 'bank_card'
                },
                confirmation: {
                    type: 'redirect',
                    return_url: 'http://localhost:3000/projects/' + stage.projectId
                },
                capture: true,
                description: `Оплата этапа "${stage.name}" проекта ID:${stage.projectId}`,
                metadata: {
                    stageId: stage.id.toString(),
                    projectId: stage.projectId.toString()
                }
            };

            this.logger.log(`Creating payment for stage ${stage.id} with payload:`, JSON.stringify(createPayload));
            const payment = await this.yooKassa.createPayment(createPayload);
            this.logger.log(`Created payment ${payment.id} for stage ${stage.id}, payment data:`, JSON.stringify(payment));

            // Return payment details including confirmation URL
            const result = {
                paymentId: payment.id, 
                paymentLink: payment.confirmation.confirmation_url,
                paymentStatus: payment.status
            };
            
            this.logger.log(`Returning payment result:`, JSON.stringify(result));
            return result;
        } catch (error) {
            this.logger.error(`Error creating payment for stage ${stage.id}`, error);
            throw error;
        }
    }

    async capturePayment(paymentId: string): Promise<void> {
        try {
            this.logger.log(`Capturing payment ${paymentId}`);
            await this.yooKassa.capturePayment(paymentId, {
                amount: {
                    value: "0.0",
                    currency: "RUB"
                }
            });
            this.logger.log(`Payment ${paymentId} captured successfully`);
        } catch (error) {
            this.logger.error(`Error capturing payment ${paymentId}`, error);
            throw error;
        }
    }

    async cancelPayment(paymentId: string): Promise<void> {
        try {
            this.logger.log(`Cancelling payment ${paymentId}`);
            await this.yooKassa.cancelPayment(paymentId);
            this.logger.log(`Payment ${paymentId} cancelled successfully`);
        } catch (error) {
            this.logger.error(`Error cancelling payment ${paymentId}`, error);
            throw error;
        }
    }
    
    async getPaymentInfo(paymentId: string) {
        try {
            this.logger.log(`Getting payment info for ${paymentId}`);
            return await this.yooKassa.getPayment(paymentId);
        } catch (error) {
            this.logger.error(`Error getting payment info for ${paymentId}`, error);
            throw error;
        }
    }
}