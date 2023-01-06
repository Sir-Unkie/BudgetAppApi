import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { TransactionRepository } from './repositories/transactions.repository';

@Module({
  imports: [
    // TODO: check if this config module is needed here
    ConfigModule,
    TypeOrmModule.forFeature([Transaction]),
  ],
  controllers: [TransactionsController],
  providers: [
    TransactionsService,
    TransactionRepository,
  ],
})
export class TransactionsModule {}
