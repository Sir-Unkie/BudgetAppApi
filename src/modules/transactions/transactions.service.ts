import { Injectable, NotFoundException } from '@nestjs/common';
import { Between } from 'typeorm';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionRepository } from './repositories/transactions.repository';
import * as dayjs from 'dayjs';
import { User } from 'src/modules/users/entities/user.entity';
import { ITransactionApiResponse } from 'src/modules/transactions/types';
import { CategoryRepository } from 'src/modules/categories/repositories/category.repository';

@Injectable()
export class TransactionsService {
	constructor(
		private transactionRepository: TransactionRepository,
		private readonly categoryRepository: CategoryRepository,
	) {}

	async create(
		createTransactionDto: CreateTransactionDto,
		user: User,
	): Promise<ITransactionApiResponse> {
		try {
			const { budgetId, categoryId } = createTransactionDto;

			const createdTransaction = this.transactionRepository.create({
				...createTransactionDto,
				user,
				budget: { id: budgetId },
				category: { id: categoryId },
			});

			const [savedTransaction, foundCategory] = await Promise.all([
				this.transactionRepository.save(createdTransaction),
				this.categoryRepository.findOne({
					where: { id: categoryId },
					relations: { budget: true },
				}),
			]);

			return {
				amount: savedTransaction.amount,
				budget: foundCategory?.budget.name ?? null,
				category: foundCategory?.name ?? null,
				comment: savedTransaction.comment,
				date: savedTransaction.date,
				id: savedTransaction.id,
			};
		} catch (error) {
			throw error;
		}
	}

	// TODO: consider better filtering logic
	async findAll(
		user: User,
		startDate?: string,
		endDate?: string,
		budgetId?: string,
		categoryId?: string,
	): Promise<ITransactionApiResponse[]> {
		endDate = endDate ?? dayjs().toISOString();
		startDate = startDate ?? dayjs().startOf('month').toISOString();

		const allTransactions = await this.transactionRepository.find({
			where: {
				user: { id: user.id },
				date: Between(startDate, endDate),
				// TODO: check this
				budget: { id: Number(budgetId) ?? undefined },
				category: { id: Number(categoryId) ?? undefined },
			},
			relations: {
				category: true,
				budget: true,
			},
		});

		const response: ITransactionApiResponse[] = allTransactions.map(
			transaction => ({
				amount: transaction.amount,
				budget: transaction.budget?.name ?? null,
				category: transaction.category?.name ?? null,
				comment: transaction.comment,
				date: transaction.date,
				id: transaction.id,
			}),
		);
		return response;
	}

	async findOne(id: string, user: User) {
		const foundTransaction = await this.transactionRepository.findOne({
			where: {
				id,
				user: { id: user.id },
			},
		});

		if (!foundTransaction) {
			throw new NotFoundException(`Transaction not found`);
		}
		return foundTransaction;
	}

	async update(
		id: string,
		updateTransactionDto: UpdateTransactionDto,
		user: User,
	) {
		const res = await this.transactionRepository.update(
			{ id, user: { id: user.id } },
			{
				amount: updateTransactionDto.amount,
				category: { id: updateTransactionDto.categoryId },
				budget: { id: updateTransactionDto.budgetId },
				comment: updateTransactionDto.comment,
				date: updateTransactionDto.date,
			},
		);
		if (res.affected === 0) {
			throw new NotFoundException(`Transaction not found`);
		}
		return { id, ...updateTransactionDto };
	}

	async remove(id: string, user: User) {
		try {
			const res = await this.transactionRepository.delete({
				id,
				user: { id: user.id },
			});
			if (res.affected === 0) {
				throw new NotFoundException(`Transaction not found`);
			}
			return `Transaction removed`;
		} catch (err) {
			throw err;
		}
	}
}
