import { Module } from '@nestjs/common';
import { BudgetsService } from './budgets.service';
import { BudgetsController } from './budgets.controller';
import { BudgetRepository } from './repositories/budget.repository';

@Module({
	controllers: [BudgetsController],
	providers: [BudgetsService, BudgetRepository],
	exports: [BudgetRepository],
})
export class BudgetsModule {}
