import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('request_to_project_tracking')
export class RequestToProjectTracking {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'request_id' })
    request_id: number;

    @Column({ name: 'project_id' })
    project_id: number;

    @Column({ name: 'request_created_at', type: 'timestamp' })
    request_created_at: Date;

    @Column({ name: 'project_created_at', type: 'timestamp' })
    project_created_at: Date;

    @Column({ name: 'conversion_time_seconds' })
    conversion_time_seconds: number;

    @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;
} 