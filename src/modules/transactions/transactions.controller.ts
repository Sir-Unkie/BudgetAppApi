import {
	Controller,
	Get,
	Post,
	Body,
	Param,
	Delete,
	UsePipes,
	ValidationPipe,
	Put,
	UseGuards,
	Query,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { JwtAuthGuard } from 'src/modules/auth/guards';
import { GetUser } from 'src/customDecorators/user.decorator';
import {
	FindAllTransactionsQueryParams,
	ITransactionApiResponse,
} from './types';
import { User } from 'src/modules/users/entities/user.entity';

@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class TransactionsController {
	constructor(private readonly transactionsService: TransactionsService) {}

	@Post()
	@UsePipes(ValidationPipe)
	create(
		@Body() createTransactionDto: CreateTransactionDto,
		@GetUser() user: User,
	): Promise<ITransactionApiResponse> {
		return this.transactionsService.create(createTransactionDto, user);
	}

	@Get()
	// TODO: consider better filtering logic
	@UsePipes(ValidationPipe)
	findAll(
		@GetUser() user: User,
		@Query() query: FindAllTransactionsQueryParams,
	): Promise<ITransactionApiResponse[]> {
		const { startDate, endDate, budgetId, categoryId } = query;
		return this.transactionsService.findAll(
			user,
			startDate,
			endDate,
			budgetId,
			categoryId,
		);
	}

	@Get(':id')
	findOne(@Param('id', ValidationPipe) id: string, @GetUser() user: User) {
		return this.transactionsService.findOne(id, user);
	}

	@Put(':id')
	@UsePipes(ValidationPipe)
	update(
		@Param('id') id: string,
		@Body() updateTransactionDto: UpdateTransactionDto,
		@GetUser() user: User,
	) {
		return this.transactionsService.update(id, updateTransactionDto, user);
	}

	@Delete(':id')
	remove(@Param('id') id: string, @GetUser() user: User) {
		return this.transactionsService.remove(id, user);
	}
}
