import {
	Injectable,
	BadRequestException,
	NotFoundException,
	InternalServerErrorException,
} from '@nestjs/common';
import { BudgetRepository } from 'src/modules/budgets/repositories/budget.repository';
import {
	ICategoriesFilters,
	ICategoryApiResponse,
} from 'src/modules/categories/types/index.tsx';
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
	): Promise<ICategoryApiResponse> {
		const { budgetId, name } = createCategoryDto;

		const createdCategory = this.categoryRepository.create({
			budget: { id: budgetId },
			user,
			name,
		});

		try {
			const savedCategory = await this.categoryRepository.save(createdCategory);
			return {
				id: savedCategory.id,
				budget: savedCategory.budget.name,
				name: savedCategory.name,
			};
		} catch (error) {
			throw new BadRequestException(`${error}`);
		}
	}

	async findAll(
		user: User,
		filters?: ICategoriesFilters,
	): Promise<ICategoryApiResponse[]> {
		const foundCategories = await this.categoryRepository.find({
			where: { user: { id: user.id }, budget: { id: filters?.budgetId } },
			relations: { budget: true },
		});

		const response: ICategoryApiResponse[] = foundCategories.map(category => ({
			budget: category.budget.name,
			id: category.id,
			name: category.name,
		}));

		return response;
	}

	async findOne(id: number, user: User): Promise<ICategoryApiResponse> {
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
			throw new InternalServerErrorException();
		}
	}

	async update(
		id: number,
		user: User,
		updateCategoryDto: UpdateCategoryDto,
	): Promise<ICategoryApiResponse> {
		const { budgetId, name } = updateCategoryDto;

		try {
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
			throw new InternalServerErrorException();
		}
	}

	async remove(id: number, user: User) {
		const res = await this.categoryRepository.delete({
			id,
			user: { id: user.id },
		});

		if (res.affected === 0) {
			throw new NotFoundException(`Budget not found`);
		}

		return `Category is removed`;
	}
}
