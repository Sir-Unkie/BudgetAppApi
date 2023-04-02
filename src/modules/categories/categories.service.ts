import {
	Injectable,
	NotFoundException,
	ConflictException,
} from '@nestjs/common';
import { BudgetRepository } from 'src/modules/budgets/repositories/budget.repository';
import { CategoryApiResponseDto } from 'src/modules/categories/dto/category-response.dto';
import { CategoriesQueryParams } from 'src/modules/categories/types/category.query-params';
import { User } from 'src/modules/users/entities/user.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryRepository } from './repositories/category.repository';

@Injectable()
export class CategoriesService {
	constructor(
		private readonly categoryRepository: CategoryRepository,
		private readonly budgetRepository: BudgetRepository,
	) {}

	async create(
		createCategoryDto: CreateCategoryDto,
		user: User,
	): Promise<CategoryApiResponseDto> {
		try {
			const { budgetId, name } = createCategoryDto;

			const createdCategory = this.categoryRepository.create({
				budget: { id: budgetId },
				user,
				name,
			});

			const existingCategory = await this.categoryRepository.findOneBy({
				name,
				user: { id: user.id },
				budget: { id: budgetId },
			});

			if (existingCategory) {
				throw new ConflictException(
					'Category with this name already exists in this budget',
				);
			}

			const savedCategory = await this.categoryRepository.save(createdCategory);
			return {
				id: savedCategory.id,
				budget: savedCategory.budget.name,
				name: savedCategory.name,
			};
		} catch (error) {
			throw error;
		}
	}

	async findAll(
		user: User,
		filters?: CategoriesQueryParams,
	): Promise<CategoryApiResponseDto[]> {
		try {
			const foundCategories = await this.categoryRepository.find({
				where: { user: { id: user.id }, budget: { id: filters?.budgetId } },
				relations: { budget: true },
			});

			const response: CategoryApiResponseDto[] = foundCategories.map(
				category => ({
					budget: category.budget.name,
					id: category.id,
					name: category.name,
				}),
			);

			return response;
		} catch (err) {
			throw err;
		}
	}

	async findOne(id: number, user: User): Promise<CategoryApiResponseDto> {
		try {
			const foundCategory = await this.categoryRepository.findOne({
				where: { id, user: { id: user.id } },
				relations: { budget: true },
			});

			if (!foundCategory) {
				throw new NotFoundException();
			}

			return {
				budget: foundCategory.budget.name,
				id: foundCategory.id,
				name: foundCategory.name,
			};
		} catch (err) {
			console.log('error: ', err);
			throw err;
		}
	}

	async update(
		id: number,
		user: User,
		updateCategoryDto: UpdateCategoryDto,
	): Promise<CategoryApiResponseDto> {
		try {
			const { budgetId, name } = updateCategoryDto;

			const [foundBudget, res] = await Promise.all([
				this.budgetRepository.findOneBy({ id: budgetId }),
				this.categoryRepository.update(
					{ id, user: { id: user.id } },
					{
						name,
						budget: { id: budgetId },
					},
				),
			]);

			if (res.affected === 0) {
				throw new NotFoundException(`Budget not found`);
			}

			if (!foundBudget) throw new NotFoundException();

			return { id, budget: foundBudget.name, name };
		} catch (err) {
			console.log('err: ', err);
			throw err;
		}
	}

	async remove(id: number, user: User) {
		try {
			const res = await this.categoryRepository.delete({
				id,
				user: { id: user.id },
			});

			if (res.affected === 0) {
				throw new NotFoundException(`Budget not found`);
			}

			return `Category is removed`;
		} catch (err) {
			throw err;
		}
	}
}
