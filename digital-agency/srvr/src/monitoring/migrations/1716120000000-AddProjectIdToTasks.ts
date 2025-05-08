import { MigrationInterface, QueryRunner } from "typeorm";

export class AddProjectIdToTasks1716120000000 implements MigrationInterface {
    name = 'AddProjectIdToTasks1716120000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tasks" ADD "projectId" integer`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD CONSTRAINT "FK_tasks_projects" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT "FK_tasks_projects"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "projectId"`);
    }
} 