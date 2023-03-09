import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Transaction } from '../entities/transaction.entity';

@Injectable()
export class TransactionRepository extends Repository<Transaction> {
  constructor(private dataSource: DataSource) {
    super(Transaction, dataSource.createEntityManager());
  }

  // here we can add custom queries
  // async getGreaterthan200() {
  //   return await this.findBy({
  //     amount: MoreThan(200),
  //   });
  // }
}