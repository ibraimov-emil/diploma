import { Body, Controller, HttpCode, Post } from '@nestjs/common';

import { PaymentService } from './payment.service';
import {ApiTags} from "@nestjs/swagger";
import {StagesService} from "./stage.service";

@ApiTags('Юкасса')
@Controller('yookassa')
export class YooKassaController {
    constructor(private readonly stageService: StagesService) {}

    @Post('payment')
    @HttpCode(200)
    handlePaymentNotification(@Body() notification) {
        console.log(notification)
        switch (notification.event) {
            case 'payment.succeeded':
                // Обработка успешного платежа
                this.stageService.processPaymentNotification(notification);
                break;
            case 'payment.waiting_for_capture':
                // Обработка платежа, ожидающего подтверждения
                console.log(notification.event)
                // this.stageService.processPaymentNotification(notification);
                break;
            case 'payment.canceled':
                // Обработка отмененного платежа
                console.log(notification.event)
                // this.stageService.processPaymentNotification(notification);
                break;
            case 'refund.succeeded':
                // Обработка успешного возврата средств
                console.log(notification.event)
                // this.stageService.processPaymentNotification(notification);
                break;
            default:
                console.log('default yookassa')
                break;
        }
    }
}