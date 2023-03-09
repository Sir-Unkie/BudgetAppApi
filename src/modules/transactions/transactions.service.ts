import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { Between } from 'typeorm';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionRepository } from './repositories/transactions.repository';
import * as dayjs from 'dayjs';
import { User } from 'src/modules/users/entities/user.entity';
import { ITransactionApiResponse } from 'src/modules/transactions/types';

@Injectable()
export class TransactionsService {
	constructor(private transactionRepository: TransactionRepository) {}

	async create(
		createTransactionDto: CreateTransactionDto,
		user: User,
	): Promise<ITransactionApiResponse> {
		const { budgetId, categoryId } = createTransactionDto;

		const createdTransaction = this.transactionRepository.create({
			...createTransactionDto,
			user,
			budget: { id: budgetId },
			category: { id: categoryId },
		});

		try {
			const savedTransaction = await this.transactionRepository.save(
				createdTransaction,
			);
			return {
				amount: savedTransaction.amount,
				budget: savedTransaction.budget?.name ?? null,
				category: savedTransaction.category?.name ?? null,
				comment: savedTransaction.comment,
				date: savedTransaction.date,
				id: savedTransaction.id,
			};
		} catch (error) {
			throw new BadRequestException(`${error}`);
		}
	}

	async findAll(
		user: User,
		startDate?: string,
		endDate?: string,
	): Promise<ITransactionApiResponse[]> {
		endDate = endDate ?? dayjs().toISOString();
		startDate = startDate ?? dayjs().startOf('month').toISOString();

		const allTransactions = await this.transactionRepository.find({
			where: {
				user: { id: user.id },
				date: Between(startDate, endDate),
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
			{ ...updateTransactionDto },
		);
		if (res.affected === 0) {
			throw new NotFoundException(`Transaction not found`);
		}
		// TODO: add logic with DB
		return { id, ...updateTransactionDto };
	}

	async remove(id: string, user: User) {
		const res = await this.transactionRepository.delete({
			id,
			user: { id: user.id },
		});
		if (res.affected === 0) {
			throw new NotFoundException(`Transaction not found`);
		}
		return `Transaction removed`;
	}
}
