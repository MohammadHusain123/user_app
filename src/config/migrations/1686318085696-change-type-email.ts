import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeTypeEmail1686318085696 implements MigrationInterface {
    name = 'ChangeTypeEmail1686318085696'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_master\` CHANGE \`reset_password_token\` \`reset_password_token\` varchar(256) NULL`);
        await queryRunner.query(`ALTER TABLE \`user_master\` DROP COLUMN \`reset_password_token_expire_time\``);
        await queryRunner.query(`ALTER TABLE \`user_master\` ADD \`reset_password_token_expire_time\` timestamp NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_master\` DROP COLUMN \`reset_password_token_expire_time\``);
        await queryRunner.query(`ALTER TABLE \`user_master\` ADD \`reset_password_token_expire_time\` varchar(256) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`user_master\` CHANGE \`reset_password_token\` \`reset_password_token\` varchar(256) NULL DEFAULT 'NULL'`);
    }

}
