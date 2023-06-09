import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIsActiveUser1686296984546 implements MigrationInterface {
    name = 'AddIsActiveUser1686296984546'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_master\` ADD \`is_active\` tinyint NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE \`user_master\` CHANGE \`reset_password_token\` \`reset_password_token\` varchar(256) NULL`);
        await queryRunner.query(`ALTER TABLE \`user_master\` CHANGE \`reset_password_token_expire_time\` \`reset_password_token_expire_time\` varchar(256) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_master\` CHANGE \`reset_password_token_expire_time\` \`reset_password_token_expire_time\` varchar(256) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`user_master\` CHANGE \`reset_password_token\` \`reset_password_token\` varchar(256) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`user_master\` DROP COLUMN \`is_active\``);
    }

}
