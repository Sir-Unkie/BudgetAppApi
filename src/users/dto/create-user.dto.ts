import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {
  @IsEmail()
  userEmail: string;
      
  @IsString()
  @MinLength(4)
  @MaxLength(30)
  password: string;
}
