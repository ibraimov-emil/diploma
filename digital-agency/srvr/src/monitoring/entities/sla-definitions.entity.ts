import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('sla_definitions')
export class SLADefinitions {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'metric_name', nullable: true })
    metric_name: string;

    @Column('decimal', { name: 'target_value', nullable: true })
    target_value: number;

    @Column({ name: 'period', nullable: true })
    period: string;

    @Column({ name: 'description', nullable: true })
    description: string;

    @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @Column({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updated_at: Date;
} 