import { Body, Controller, Delete, ForbiddenException, Get, Param, ParseIntPipe, Post, Put, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards';
import { Roles } from 'src/customDecorators/roles.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-User.dto';
import { UsersService } from './users.service';
import { GetUser } from 'src/customDecorators/user.decorator';
import { User } from './entities/user.entity';
import { ERoles } from 'src/roles/types/roles.enum';
import { RolesGuard } from 'src/auth/guards';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(ERoles.admin)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }
  
  @Get()
  @Roles(ERoles.user, ERoles.admin)
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Put(':id')
  @Roles(ERoles.user, ERoles.admin)
  @UsePipes(ValidationPipe)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTransactionDto: UpdateUserDto,
    @GetUser() user: User,
  ) {
    if (id !== user.id && user.role.roleName !== ERoles.admin) {
      throw new ForbiddenException();
    }
    return this.usersService.update(id, updateTransactionDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}
