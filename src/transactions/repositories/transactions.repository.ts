import { DataSource, MoreThan, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Transaction } from '../entities/transaction.entity';

@Injectable()
export class TransactionRepository extends Repository<Transaction> {
  constructor(private dataSource: DataSource) {
    super(Transaction, dataSource.createEntityManager());
  }

  async getGreaterthan200() {
    return await this.findBy({
      amount: MoreThan(200),
    });
  }

  async getEqual300() {
    const query = this.createQueryBuilder('transaction');

    query.andWhere('transaction.amount = :value', { value: 300 });
    
    const transactions = await query.getMany();    
    return transactions;
  }
}
