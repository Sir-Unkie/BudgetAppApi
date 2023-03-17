import { IsOptional, IsDateString, IsString } from 'class-validator';

export class FindAllTransactionsQueryParams {
	@IsDateString(undefined, {
		message:
			'The $property value in query param should be in ISO format, but value provided is $value',
	})
	@IsOptional()
	startDate?: string;

	@IsDateString(undefined, {
		message:
			'The $property value in query param should be in ISO format, but value provided is $value',
	})
	@IsOptional()
	endDate?: string;

	@IsOptional()
	@IsString()
	budgetId?: string;

	@IsOptional()
	@IsString()
	categoryId?: string;
}

export class ITransactionApiResponse {
	id: string;
	amount: number;
	comment: string | null;
	date: string;
	budget: string | null;
	category: string | null;
}
