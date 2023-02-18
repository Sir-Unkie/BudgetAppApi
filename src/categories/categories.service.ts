import { Injectable, BadRequestException } from "@nestjs/common";
import { BudgetRepository } from "src/budgets/repositories/budget.repository";
import { User } from "src/users/entities/user.entity";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { CategoryRepository } from "./repositories/category.repository";

@Injectable()
export class CategoriesService {
	constructor(
		private readonly categoryRepository: CategoryRepository,
		private readonly budgetRepository: BudgetRepository,
	) {}

	async create(createCategoryDto: CreateCategoryDto, user: User) {
		const { budgetId, name } = createCategoryDto;

		const createdCategory = this.categoryRepository.create({
			budget: { id: budgetId },
			user,
			name,
		});

		try {
			const savedCategory = await this.categoryRepository.save(createdCategory);
			return savedCategory;
		} catch (error) {
			throw new BadRequestException(`${error}`);
		}
	}

	async findAll(user: User) {
		const foundCategories = await this.categoryRepository.find({
			where: { user },
			relations: { budget: true },
		});

		return foundCategories;
	}

	findOne(id: number) {
		// TODO: add logic with DB
		return `This action returns a #${id} category`;
	}

	update(id: number, updateCategoryDto: UpdateCategoryDto) {
		console.log("updateCategoryDto: ", updateCategoryDto);
		// TODO: add logic with DB
		return `This action updates a #${id} category`;
	}

	remove(id: number) {
		// TODO: add logic with DB
		return `This action removes a #${id} category`;
	}
}
