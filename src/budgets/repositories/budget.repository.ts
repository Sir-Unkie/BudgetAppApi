import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Budget } from '../entities/budget.entity';

@Injectable()
export class BudgetRepository extends Repository<Budget> {
  constructor(private dataSource: DataSource) {
    super(Budget, dataSource.createEntityManager());
  }
}
