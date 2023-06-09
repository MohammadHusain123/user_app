import { ROLE } from "src/helpers/role.enum";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('user_master')
export class User {

    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'varchar', length: 20, nullable: false })
    first_name: string

    @Column({ type: 'varchar', length: 20, nullable: false })
    last_name: string

    @Column({ type: 'varchar', nullable: false, unique: true, length: 100 })
    email: string

    @Column({ type: 'varchar', nullable: false, unique: true, length: 256 })
    password: string

    @Column({ type: 'enum', nullable: false, enum: ROLE, default: ROLE.SUBADMIN })
    role: string

    @Column({ type: 'varchar', length: 256, nullable: true, default: null })
    reset_password_token: string

    @Column({ type: 'timestamp', nullable: true, default: null })
    reset_password_token_expire_time: Date

    @Column({ type: 'boolean', nullable: false, default: 1 })
    is_active: boolean

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date

}
