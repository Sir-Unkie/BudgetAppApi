import { IsEmail } from 'class-validator';
import { Budget } from 'src/modules/budgets/entities/budget.entity';
import { Category } from 'src/modules/categories/entities/category.entity';
import { Role } from 'src/modules/roles/entities/role.entity';
import { RefreshToken } from 'src/modules/tokens/entities/refresh-token.entity';
import { Transaction } from 'src/modules/transactions/entities/transaction.entity';
import {
	Column,
	Entity,
	ManyToOne,
	OneToMany,
	OneToOne,
	PrimaryGeneratedColumn,
	Unique,
} from 'typeorm';

@Entity()
@Unique(['userEmail'])
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	@IsEmail()
	userEmail: string;

	@Column({
		nullable: true,
	})
	password: string;

	@Column({
		nullable: true,
	})
	salt: string;

	@Column({
		nullable: true,
	})
	displayName: string;

	@OneToMany(() => Transaction, transaction => transaction.user)
	transactions: Transaction[];

	@OneToMany(() => Budget, budget => budget.user, { nullable: true })
	budgets: Budget[];

	@OneToMany(() => Category, category => category.user, { nullable: true })
	categories: Category[];

	@ManyToOne(() => Role)
	role: Role;

	@OneToOne(() => RefreshToken, refreshToken => refreshToken.user, {
		nullable: true,
		onDelete: 'CASCADE',
	})
	refreshToken: RefreshToken;
}
