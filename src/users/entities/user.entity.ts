import { IsEmail } from "class-validator";
import { Budget } from "src/budgets/entities/budget.entity";
import { Category } from "src/categories/entities/category.entity";
import { Role } from "src/roles/entities/role.entity";
import { Transaction } from "src/transactions/entities/transaction.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";

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

  @OneToMany(() => Transaction, transaction => transaction.user)
  transactions: Transaction[];

  @OneToMany(() => Budget, budget => budget.user, { nullable: true })
  budgets: Budget[];

  @OneToMany(() => Category, category => category.user, { nullable: true })
  categories: Category[];

  @ManyToOne(() => Role)
  role: Role;
}
