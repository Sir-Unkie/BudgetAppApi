import { Category } from "src/categories/entities/category.entity";
import { Transaction } from "src/transactions/entities/transaction.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Budget {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  annualLimit: number;

  @OneToMany(() => Category, category => category.budget)
  categories: Category[];

  @OneToMany(() => Transaction, transaction => transaction.budget)
  transactions: Transaction[];

  @ManyToOne(() => User, user=>user.budgets, { nullable: false, onDelete: "CASCADE" })
  user: User;
}
