import { IsInt, IsString } from 'class-validator';

export class CreateBudgetDto {
	@IsString()
	name: string;

	@IsInt()
	annualLimit: number;
}

export class CreateBudgetApiResponse extends CreateBudgetDto {
	id: number;
}
