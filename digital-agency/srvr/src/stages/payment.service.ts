import { Injectable } from '@nestjs/common';
import { YooKassa } from 'yookassa';
import { Stage } from './stage.model';
import {ICreatePayment, YooCheckout} from "@a2seven/yoo-checkout";
import {InjectModel} from "@nestjs/sequelize";
import {StagesService} from "./stage.service";

@Injectable()
export class PaymentService {
    private readonly yooKassa: YooKassa;

    constructor() {

        // this.yooKassa = new YooCheckout({ shopId: '322548', secretKey: 'test_d1VUB7y1Ips8Rgc9chVzN73kgHqe79ay1xag9AXtO2M' })
        this.yooKassa = new YooCheckout({ shopId: process.env.SHOP_ID, secretKey: process.env.PAYMENT_SECRET })
    }

    async createPayment(stage: Stage) {

        const createPayload: ICreatePayment = {
            amount: {
                value: stage.cost.toString(),
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
            description: `Payment for Stage ${stage.id}`, // Укажите описание платежа3
        };

        const payment = await this.yooKassa.createPayment(createPayload)

        // await this.stageService.updateStage(stage.id, {...stage, paymentId:payment.id});
        // Верните идентификатор платежа
        return {paymentId: payment.id, paymentLink: payment.confirmation.confirmation_url};
    }

    async capturePayment(paymentId: string): Promise<void> {
        console.log(paymentId)
        await this.yooKassa.capturePayment(paymentId);
    }

    async cancelPayment(paymentId: string): Promise<void> {
        await this.yooKassa.cancelPayment(paymentId);
    }
}