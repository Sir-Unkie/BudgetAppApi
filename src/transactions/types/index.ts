import { IsOptional, IsDateString } from "class-validator";

export class FindAllTransactionsQueryParams {
  @IsDateString(
    undefined,
    {
      message: 'The $property value in query param should be in ISO format, but value provided is $value',
    })
  @IsOptional()
  startDate?: string;

  @IsDateString(
    undefined,
    {
      message: 'The $property value in query param should be in ISO format, but value provided is $value',
    })
  @IsOptional()
  endDate?: string;
}