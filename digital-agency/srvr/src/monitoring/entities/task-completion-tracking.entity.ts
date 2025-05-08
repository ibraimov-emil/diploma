import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('task_completion_tracking')
export class TaskCompletionTracking {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'task_id' })
    task_id: number;

    @Column({ name: 'project_id' })
    project_id: number;

    @Column({ name: 'due_date', type: 'timestamp' })
    due_date: Date;

    @Column({ name: 'completed_at', type: 'timestamp' })
    completed_at: Date;

    @Column({ name: 'completed_on_time' })
    completed_on_time: boolean;

    @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;
} 