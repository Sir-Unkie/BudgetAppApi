import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { TransactionRepository } from './repositories/transactions.repository';
import { CategoriesModule } from 'src/modules/categories/categories.module';

@Module({
	imports: [CategoriesModule],
	controllers: [TransactionsController],
	providers: [TransactionsService, TransactionRepository],
})
export class TransactionsModule {}
