import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
import { Budget } from './entities/budget.entity';
import { BudgetRepository } from './repositories/budget.repository';

@Injectable()
export class BudgetsService {
  constructor(private readonly budgetRepository: BudgetRepository) {}

  async create(createBudgetDto: CreateBudgetDto, user: User): Promise<Budget> {
    const existingBudget = await this.budgetRepository.findOneBy({ name: createBudgetDto.name, user });

    if (existingBudget) {
      throw new ConflictException('Budget with this name already exists');
    }

    const createdBudget = this.budgetRepository.create({
      ...createBudgetDto,
      user,
    });

    const savedBudget = this.budgetRepository.save(createdBudget);
    // TODO: remove user data from returned object
    return savedBudget;
  }

  async findAll(user: User) {
    const budgets = await this.budgetRepository.find({
      where: { user },
      relations: { categories: true },
    });
    // const budgets = await this.budgetRepository.createQueryBuilder('budget').where("budget.userId = :userId", { userId: user.id }).getMany();
    return budgets;
  }

  async findOne(id: number, user: User): Promise<Budget> {
    const foundBudget = await this.budgetRepository.findOneBy({ id, user });
    if (!foundBudget) {
      throw new NotFoundException();
    }
    return foundBudget;
  }

  async update(id: number, updateBudgetDto: UpdateBudgetDto, user: User) {
    const res = await  this.budgetRepository.update({ id, user }, { ...updateBudgetDto, user }); 

    if (res.affected === 0) {
      throw new NotFoundException(`Budget not found`);
    }

    return { id, ...updateBudgetDto };
  }

  async remove(id: number, user: User) {
    const res = await this.budgetRepository.delete({ id, user });

    if (res.affected === 0) {
      throw new NotFoundException(`Budget not found`);
    }

    return `Budget removed`;
  }
}
