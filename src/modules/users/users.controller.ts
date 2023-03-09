import {
	Body,
	Controller,
	Delete,
	ForbiddenException,
	Get,
	Param,
	ParseIntPipe,
	Post,
	Put,
	UseGuards,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/guards';
import { Roles } from 'src/customDecorators/roles.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-User.dto';
import { UsersService } from './users.service';
import { GetUser } from 'src/customDecorators/user.decorator';
import { User } from './entities/user.entity';
import { RolesGuard } from 'src/modules/auth/guards';
import { ERoles } from 'src/modules/roles/types/roles.enum';
import { IUserApiResponse } from 'src/modules/users/types/userResponse.type';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(ERoles.admin)
@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Get()
	findAll(): Promise<IUserApiResponse[]> {
		return this.usersService.findAll();
	}

	@Get(':id')
	@Roles(ERoles.user, ERoles.admin)
	findOne(
		@Param('id', ParseIntPipe) id: number,
		@GetUser() user: User,
	): Promise<IUserApiResponse> {
		if (id !== user.id && user.role.roleName === ERoles.user) {
			throw new ForbiddenException();
		}

		return this.usersService.findOne(id);
	}

	@Post()
	@UsePipes(ValidationPipe)
	create(@Body() createUserDto: CreateUserDto): Promise<IUserApiResponse> {
		return this.usersService.create(createUserDto);
	}

	@Put(':id')
	@Roles(ERoles.user, ERoles.admin)
	@UsePipes(ValidationPipe)
	update(
		@Param('id', ParseIntPipe) id: number,
		@Body() updateTransactionDto: UpdateUserDto,
		@GetUser() user: User,
	): Promise<IUserApiResponse> {
		if (id !== user.id && user.role.roleName !== ERoles.admin) {
			throw new ForbiddenException();
		}

		return this.usersService.update(id, updateTransactionDto);
	}

	@Delete(':id')
	@Roles(ERoles.user, ERoles.admin)
	remove(
		@Param('id', ParseIntPipe) id: number,
		@GetUser() user: User,
	): Promise<string> {
		if (id !== user.id && user.role.roleName !== ERoles.admin) {
			throw new ForbiddenException();
		}

		return this.usersService.remove(id);
	}
}
