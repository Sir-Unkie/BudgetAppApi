import { IsString, IsInt, IsPositive } from "class-validator";

export class CreateCategoryDto {
  @IsString()
  name: string;

  @IsInt()
  @IsPositive()
  budgetId: number;
}