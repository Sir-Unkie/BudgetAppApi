import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { Between } from 'typeorm';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionRepository } from './repositories/transactions.repository';
import * as dayjs from 'dayjs';

@Injectable()
export class TransactionsService {
  constructor(private transactionRepository: TransactionRepository) {}

  async create(createTransactionDto: CreateTransactionDto, user: User) {
    const { budgetId, categoryId } = createTransactionDto;

    const createdTransaction = this.transactionRepository.create({
      ...createTransactionDto,
      user,
      budget: { id: budgetId },
      category: { id: categoryId },
    });

    try {
      const savedTransaction = await this.transactionRepository.save(
        createdTransaction
      );
      return savedTransaction;
    } catch (error) {
      throw new BadRequestException(`${error}`);
    }
  }

  async findAll(user: User, startDate?: string, endDate?: string) {
    endDate = endDate ?? dayjs().toISOString();
    startDate = startDate ?? dayjs().startOf('month').toISOString();

    const allTransactions = await this.transactionRepository.find({
      where: {
        user,
        date: Between(startDate, endDate),
      },
      relations: {
        user: true,
        category: true,
        budget: true,
      },
    });
    return allTransactions;
  }

  async findOne(id: number, user: User) {
    const foundTransaction = await this.transactionRepository.findOne({
      where: {
        id,
        user,
      },
    });

    if (!foundTransaction) {
      throw new NotFoundException(`Transaction not found`);
    }
    return foundTransaction;
  }

  async update(
    id: number,
    updateTransactionDto: UpdateTransactionDto,
    user: User
  ) {
    const res = await this.transactionRepository.update(
      { id, user },
      { ...updateTransactionDto }
    );
    if (res.affected === 0) {
      throw new NotFoundException(`Transaction not found`);
    }
    // TODO: add logic with DB
    return { id, ...updateTransactionDto };
  }

  async remove(id: number, user: User) {
    const res = await this.transactionRepository.delete({ id, user });
    if (res.affected === 0) {
      throw new NotFoundException(`Transaction not found`);
    }
    return `Transaction removed`;
  }
}
