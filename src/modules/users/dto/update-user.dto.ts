import {
	IsEmail,
	IsOptional,
	IsString,
	MaxLength,
	MinLength,
} from 'class-validator';

export class UpdateUserDto {
	@IsEmail()
	userEmail: string;

	@IsOptional()
	@IsString()
	@MinLength(4)
	@MaxLength(30)
	displayName?: string;
}
