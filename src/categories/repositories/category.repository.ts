import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Category } from '../entities/category.entity';

@Injectable()
export class CategoryRepository extends Repository<Category> {
  constructor(private dataSource: DataSource) {
    super(Category, dataSource.createEntityManager());
  }
}
