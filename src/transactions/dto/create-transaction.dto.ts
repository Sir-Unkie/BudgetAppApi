import { IsInt } from "class-validator";

export class CreateTransactionDto {
  @IsInt()
  amount: number;
}
