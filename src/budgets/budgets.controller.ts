import { Controller, Get, Post, Body, Param, Delete, Put, ParseIntPipe, UsePipes, ValidationPipe, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards';
import { GetUser } from 'src/customDecorators/user.decorator';
import { User } from 'src/users/entities/user.entity';
import { BudgetsService } from './budgets.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';

@Controller('budgets')
@UseGuards(JwtAuthGuard)
export class BudgetsController {
  constructor(private readonly budgetsService: BudgetsService) {}

  @Post()
  @UsePipes(ValidationPipe)
  create(
    @Body() createBudgetDto: CreateBudgetDto,
    @GetUser() user: User,
  ) {
    return this.budgetsService.create(createBudgetDto, user);
  }

  @Get()
  findAll(@GetUser() user: User) {
    return this.budgetsService.findAll(user);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ) {
    return this.budgetsService.findOne(id, user);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBudgetDto: UpdateBudgetDto,
    @GetUser() user: User,
  ) {
    return this.budgetsService.update(id, updateBudgetDto, user);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ) {
    return this.budgetsService.remove(id, user);
  }
}
