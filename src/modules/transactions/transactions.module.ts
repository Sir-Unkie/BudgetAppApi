import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { TransactionRepository } from './repositories/transactions.repository';

@Module({
	controllers: [TransactionsController],
	providers: [TransactionsService, TransactionRepository],
})
export class TransactionsModule {}
