import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('invoice_payment_tracking')
export class InvoicePaymentTracking {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'invoice_id' })
    invoice_id: number;

    @Column({ name: 'project_id' })
    project_id: number;

    @Column({ name: 'invoice_created_at', type: 'timestamp' })
    invoice_created_at: Date;

    @Column({ name: 'payment_received_at', type: 'timestamp' })
    payment_received_at: Date;

    @Column({ name: 'payment_time_seconds' })
    payment_time_seconds: number;

    @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;
} 