import { Budget } from "src/budgets/entities/budget.entity";
import { Transaction } from "src/transactions/entities/transaction.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Budget, budget => budget.categories, { nullable: false, onDelete: "CASCADE" })
  budget: Budget;

  @ManyToOne(() => User, user => user.categories, { nullable: false, onDelete: "CASCADE" })
  user: User;

  @OneToMany(() => Transaction, transaction => transaction.category)
  transactions: Transaction[];
}
