import {
	Controller,
	Get,
	Post,
	Body,
	Param,
	Delete,
	Put,
	ParseIntPipe,
	UsePipes,
	ValidationPipe,
	UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/guards';
import { GetUser } from 'src/customDecorators/user.decorator';
import { User } from 'src/modules/users/entities/user.entity';
import { BudgetsService } from './budgets.service';
import {
	CreateBudgetApiResponse,
	CreateBudgetDto,
} from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
import { ROUTES } from 'src/constants/routes.constants';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags(ROUTES.BUDGETS)
@Controller(ROUTES.BUDGETS)
@UseGuards(JwtAuthGuard)
export class BudgetsController {
	constructor(private readonly budgetsService: BudgetsService) {}

	@Post()
	@ApiOperation({ summary: 'Create budget' })
	@UsePipes(ValidationPipe)
	create(
		@Body() createBudgetDto: CreateBudgetDto,
		@GetUser() user: User,
	): Promise<CreateBudgetApiResponse> {
		return this.budgetsService.create(createBudgetDto, user);
	}

	@Get()
	@ApiOperation({ summary: 'Get budgets' })
	findAll(@GetUser() user: User) {
		return this.budgetsService.findAll(user);
	}

	@Get(':id')
	@ApiOperation({ summary: 'Get budget by ID' })
	findOne(@Param('id', ParseIntPipe) id: number, @GetUser() user: User) {
		return this.budgetsService.findOne(id, user);
	}

	@Put(':id')
	@ApiOperation({ summary: 'Update budget by ID' })
	update(
		@Param('id', ParseIntPipe) id: number,
		@Body() updateBudgetDto: UpdateBudgetDto,
		@GetUser() user: User,
	) {
		return this.budgetsService.update(id, updateBudgetDto, user);
	}

	@Delete(':id')
	@ApiOperation({ summary: 'Delete budget by ID' })
	remove(@Param('id', ParseIntPipe) id: number, @GetUser() user: User) {
		return this.budgetsService.remove(id, user);
	}
}
