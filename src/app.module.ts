import { Module } from '@nestjs/common';
import { AuthModule } from './api/auth/auth.module';
import { UserModule } from './api/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from './config/conn';

@Module({
  imports: [TypeOrmModule.forRoot(config),
    AuthModule, UserModule],
  controllers: [],
})
export class AppModule { }
