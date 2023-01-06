import {  Injectable, NotFoundException } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import {  TransactionRepository } from './repositories/transactions.repository';

@Injectable()
export class TransactionsService {
  constructor(private transactionsRepository: TransactionRepository) { }

  async create(createTransactionDto: CreateTransactionDto) {
    const createdTransaction = this.transactionsRepository.create(createTransactionDto);
    await createdTransaction.save();
    return createdTransaction;
  }

  async findAll() {
    const allTransactions = await this.transactionsRepository.find();
    return allTransactions;
  }

  async findOne(id: number) {
    const foundTransaction = await this.transactionsRepository.findOneBy({ id });
    
    if (!foundTransaction) {
      throw new NotFoundException(`Transaction with ID=${id} not found`);
    }
    return foundTransaction;
  }

  async update(id: number, updateTransactionDto: UpdateTransactionDto) {
    const res = await this.transactionsRepository.update({ id }, { ...updateTransactionDto });
    if (res.affected === 0) {
      throw new NotFoundException(`Transaction with ID=${id} not found`);
    }
    return { id, ...updateTransactionDto };
  }

  async remove(id: number) {
    const res = await this.transactionsRepository.delete(id);
    if (res.affected === 0) {
      throw new NotFoundException(`Transaction with ID=${id} not found`);
    }
    return `Transaction removed`;
  }
}
