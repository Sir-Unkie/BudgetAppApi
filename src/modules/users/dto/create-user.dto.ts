import { IsString, MaxLength, MinLength } from 'class-validator';
import { UpdateUserDto } from 'src/modules/users/dto/update-User.dto';

export class CreateUserDto extends UpdateUserDto {
	@IsString()
	@MinLength(4)
	@MaxLength(30)
	password: string;
}
