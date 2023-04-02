import {
	IsInt,
	IsOptional,
	IsString,
	IsDateString,
	IsPositive,
} from 'class-validator';

export class CreateTransactionDto {
	@IsInt()
	@IsPositive()
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
