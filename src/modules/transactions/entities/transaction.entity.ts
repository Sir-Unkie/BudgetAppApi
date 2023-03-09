import { Budget } from 'src/modules/budgets/entities/budget.entity';
import { Category } from 'src/modules/categories/entities/category.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Transaction {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	amount: number;

	@Column({
		nullable: true,
	})
	comment: string;

	@Column({
		type: 'timestamp',
	})
	date: string;

	@ManyToOne(() => User, user => user.transactions, {
		nullable: false,
		onDelete: 'CASCADE',
	})
	user: User;

	@ManyToOne(() => Budget, budget => budget.transactions, {
		onDelete: 'SET NULL',
		nullable: true,
	})
	budget: Budget | null;

	@ManyToOne(() => Category, category => category.transactions, {
		onDelete: 'SET NULL',
		nullable: true,
	})
	category: Category | null;
}
