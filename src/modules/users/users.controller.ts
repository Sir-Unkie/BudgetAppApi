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
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { GetUser } from 'src/customDecorators/user.decorator';
import { User } from './entities/user.entity';
import { RolesGuard } from 'src/modules/auth/guards';
import { ERoles } from 'src/modules/roles/types/roles.enum';
import { UserApiResponseDto } from 'src/modules/users/dto/userResponse.dto';
import { ROUTES } from 'src/constants/routes.constants';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags(ROUTES.USERS)
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(ERoles.admin)
@Controller(ROUTES.USERS)
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Get()
	@ApiOperation({ summary: 'Get all users' })
	findAll(): Promise<UserApiResponseDto[]> {
		return this.usersService.findAll();
	}

	@Get(':id')
	@ApiOperation({ summary: 'Get user by id' })
	@Roles(ERoles.user, ERoles.admin)
	findOne(
		@Param('id', ParseIntPipe) id: number,
		@GetUser() user: User,
	): Promise<UserApiResponseDto> {
		if (id !== user.id && user.role.roleName === ERoles.user) {
			throw new ForbiddenException();
		}

		return this.usersService.findOne(id);
	}

	@Post()
	@ApiOperation({ summary: 'Create user' })
	@UsePipes(ValidationPipe)
	create(@Body() createUserDto: CreateUserDto): Promise<UserApiResponseDto> {
		return this.usersService.create(createUserDto);
	}

	@Put(':id')
	@ApiOperation({ summary: 'Update user by id' })
	@Roles(ERoles.user, ERoles.admin)
	@UsePipes(ValidationPipe)
	update(
		@Param('id', ParseIntPipe) id: number,
		@Body() updateTransactionDto: UpdateUserDto,
		@GetUser() user: User,
	): Promise<UserApiResponseDto> {
		if (id !== user.id && user.role.roleName !== ERoles.admin) {
			throw new ForbiddenException();
		}

		return this.usersService.update(id, updateTransactionDto);
	}

	@Delete(':id')
	@ApiOperation({ summary: 'Delete user by id' })
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
