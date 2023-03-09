import { Category } from 'src/modules/categories/entities/category.entity';
import { Transaction } from 'src/modules/transactions/entities/transaction.entity';
import { User } from 'src/modules/users/entities/user.entity';
import {
	Column,
	Entity,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Budget {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@Column()
	annualLimit: number;

	@OneToMany(() => Category, category => category.budget, {
		onDelete: 'SET NULL',
		nullable: true,
	})
	categories: Category[];

	@OneToMany(() => Transaction, transaction => transaction.budget, {
		onDelete: 'SET NULL',
		nullable: true,
	})
	transactions: Transaction[];

	@ManyToOne(() => User, user => user.budgets, {
		nullable: false,
		onDelete: 'CASCADE',
	})
	user: User;
}
