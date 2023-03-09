import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { CategoryRepository } from './repositories/category.repository';
import { BudgetsModule } from 'src/modules/budgets/budgets.module';

@Module({
	controllers: [CategoriesController],
	providers: [CategoriesService, CategoryRepository],
	imports: [BudgetsModule],
	exports: [CategoriesService, CategoryRepository],
})
export class CategoriesModule {}
