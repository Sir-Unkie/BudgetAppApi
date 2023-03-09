import { IsInt, IsOptional, IsString, IsDateString } from 'class-validator';

export class CreateTransactionDto {
  @IsInt()
  amount: number;

  @IsString()
  @IsOptional()
  comment?: string;

  @IsInt()
  budgetId: number;

  @IsInt()
  categoryId: number;

  @IsDateString()
  date: string;
}
