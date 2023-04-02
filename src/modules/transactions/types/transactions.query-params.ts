import { IsOptional, IsDateString, IsString } from 'class-validator';

export class FindAllTransactionsQueryParams {
	/**
	 * Start date
	 */
	@IsDateString(undefined, {
		message:
			'The $property value in query param should be in ISO format, but value provided is $value',
	})
	@IsOptional()
	startDate?: string;

	/**
	 * End date
	 */
	@IsDateString(undefined, {
		message:
			'The $property value in query param should be in ISO format, but value provided is $value',
	})
	@IsOptional()
	endDate?: string;

	/**
	 * Budget id to filter
	 */
	@IsOptional()
	@IsString()
	budgetId?: string;

	/**
	 * Category id to filter
	 */
	@IsOptional()
	@IsString()
	categoryId?: string;
}
