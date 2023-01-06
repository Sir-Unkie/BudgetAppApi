import { Module } from '@nestjs/common';
import { UsersModule  } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { TransactionsModule } from './transactions/transactions.module';
import { typeOrmConfig } from './config/typeorm.config';
import { TypeOrmModule } from '@nestjs/typeorm/dist';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UsersModule,
    AuthModule,
    TransactionsModule,
    TypeOrmModule.forRoot(typeOrmConfig),
  ],
})
export class AppModule {}
