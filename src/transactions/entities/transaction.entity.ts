import { Budget } from "src/budgets/entities/budget.entity";
import { Category } from "src/categories/entities/category.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  amount: number;

  @Column({
    nullable: true,
  })
  comment: string;

  @Column({
    type: "timestamp",
  })
  date: string;

  @ManyToOne(() => User, user => user.transactions, { nullable: false, onDelete: "CASCADE" })
  user: User;

  @ManyToOne(() => Budget, budget => budget.transactions, {  onDelete: "SET NULL" })
  budget: Budget;
  
  @ManyToOne(() => Category, category => category.transactions, { onDelete: "SET NULL" })
  category: Category;
}
