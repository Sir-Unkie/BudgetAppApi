import {
	Injectable,
	ConflictException,
	NotFoundException,
} from '@nestjs/common';
import { User } from 'src/modules/users/entities/user.entity';
import {
	CreateBudgetApiResponse,
	CreateBudgetDto,
} from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
import { Budget } from './entities/budget.entity';
import { BudgetRepository } from './repositories/budget.repository';

@Injectable()
export class BudgetsService {
	constructor(private readonly budgetRepository: BudgetRepository) {}

	async create(
		createBudgetDto: CreateBudgetDto,
		user: User,
	): Promise<CreateBudgetApiResponse> {
		try {
			const existingBudget = await this.budgetRepository.findOneBy({
				name: createBudgetDto.name,
				user: { id: user.id },
			});

			if (existingBudget) {
				throw new ConflictException('Budget with this name already exists');
			}

			const createdBudget = this.budgetRepository.create({
				...createBudgetDto,
				user,
			});

			const { id, name, annualLimit } = await this.budgetRepository.save(
				createdBudget,
			);

			return { id, name, annualLimit };
		} catch (err) {
			throw err;
		}
	}

	async findAll(user: User) {
		try {
			const budgets = await this.budgetRepository.find({
				where: { user: { id: user.id } },
				relations: { categories: true },
			});

			return budgets;
		} catch (err) {
			throw err;
		}
	}

	async findOne(id: number, user: User): Promise<Budget> {
		try {
			const foundBudget = await this.budgetRepository.findOneBy({
				id,
				user: { id: user.id },
			});

			if (!foundBudget) {
				throw new NotFoundException();
			}

			return foundBudget;
		} catch (err) {
			throw err;
		}
	}

	async update(id: number, updateBudgetDto: UpdateBudgetDto, user: User) {
		try {
			const res = await this.budgetRepository.update(
				{ id, user: { id: user.id } },
				{ ...updateBudgetDto, user },
			);

			if (res.affected === 0) {
				throw new NotFoundException(`Budget not found`);
			}

			return { id, ...updateBudgetDto };
		} catch (err) {
			throw err;
		}
	}

	async remove(id: number, user: User) {
		try {
			const res = await this.budgetRepository.delete({
				id,
				user: { id: user.id },
			});

			if (res.affected === 0) {
				throw new NotFoundException(`Budget not found`);
			}

			return `Budget removed`;
		} catch (err) {
			throw err;
		}
	}
}
