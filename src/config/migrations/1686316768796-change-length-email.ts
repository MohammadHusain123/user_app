import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeLengthEmail1686316768796 implements MigrationInterface {
    name = 'ChangeLengthEmail1686316768796'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_21c94be20949d4fa08693fe292\` ON \`user_master\``);
        await queryRunner.query(`ALTER TABLE \`user_master\` DROP COLUMN \`email\``);
        await queryRunner.query(`ALTER TABLE \`user_master\` ADD \`email\` varchar(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user_master\` ADD UNIQUE INDEX \`IDX_21c94be20949d4fa08693fe292\` (\`email\`)`);
        await queryRunner.query(`ALTER TABLE \`user_master\` CHANGE \`reset_password_token\` \`reset_password_token\` varchar(256) NULL`);
        await queryRunner.query(`ALTER TABLE \`user_master\` CHANGE \`reset_password_token_expire_time\` \`reset_password_token_expire_time\` varchar(256) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_master\` CHANGE \`reset_password_token_expire_time\` \`reset_password_token_expire_time\` varchar(256) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`user_master\` CHANGE \`reset_password_token\` \`reset_password_token\` varchar(256) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`user_master\` DROP INDEX \`IDX_21c94be20949d4fa08693fe292\``);
        await queryRunner.query(`ALTER TABLE \`user_master\` DROP COLUMN \`email\``);
        await queryRunner.query(`ALTER TABLE \`user_master\` ADD \`email\` varchar(40) NOT NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_21c94be20949d4fa08693fe292\` ON \`user_master\` (\`email\`)`);
    }

}
