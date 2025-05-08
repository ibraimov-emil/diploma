import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('chat_response_tracking')
export class ChatResponseTracking {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'chat_id' })
    chat_id: number;

    @Column({ name: 'message_id' })
    message_id: number;

    @Column({ name: 'sender_id' })
    sender_id: number;

    @Column({ name: 'employee_id' })
    employee_id: number;

    @Column({ name: 'message_sent_at', type: 'timestamp' })
    message_sent_at: Date;

    @Column({ name: 'response_sent_at', type: 'timestamp' })
    response_sent_at: Date;

    @Column({ name: 'response_time_seconds' })
    response_time_seconds: number;

    @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;
} 