import { MigrationInterface, QueryRunner } from "typeorm";

export class UserEntity1686295661145 implements MigrationInterface {
    name = 'UserEntity1686295661145'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`user_master\` (\`id\` int NOT NULL AUTO_INCREMENT, \`first_name\` varchar(20) NOT NULL, \`last_name\` varchar(20) NOT NULL, \`email\` varchar(40) NOT NULL, \`password\` varchar(256) NOT NULL, \`role\` enum ('super admin', 'sub admin') NOT NULL DEFAULT 'sub admin', \`reset_password_token\` varchar(256) NULL, \`reset_password_token_expire_time\` varchar(256) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_21c94be20949d4fa08693fe292\` (\`email\`), UNIQUE INDEX \`IDX_4559a8c70895ddaa1cc5f9c7f4\` (\`password\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_4559a8c70895ddaa1cc5f9c7f4\` ON \`user_master\``);
        await queryRunner.query(`DROP INDEX \`IDX_21c94be20949d4fa08693fe292\` ON \`user_master\``);
        await queryRunner.query(`DROP TABLE \`user_master\``);
    }

}
