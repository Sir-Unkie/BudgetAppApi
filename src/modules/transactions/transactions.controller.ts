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
import { TransactionResponseApiResponseDto } from './dto/transaction-response.dto';
import { User } from 'src/modules/users/entities/user.entity';
import { ROUTES } from 'src/constants/routes.constants';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FindAllTransactionsQueryParams } from 'src/modules/transactions/types/transactions.query-params';

@ApiTags(ROUTES.TRANSACTIONS)
@Controller(ROUTES.TRANSACTIONS)
@UseGuards(JwtAuthGuard)
export class TransactionsController {
	constructor(private readonly transactionsService: TransactionsService) {}

	@Post()
	@ApiOperation({ summary: 'Create transaction' })
	@UsePipes(ValidationPipe)
	create(
		@Body() createTransactionDto: CreateTransactionDto,
		@GetUser() user: User,
	): Promise<TransactionResponseApiResponseDto> {
		return this.transactionsService.create(createTransactionDto, user);
	}

	@Get()
	// TODO: consider better filtering logic
	@ApiOperation({ summary: 'Get transaction' })
	@UsePipes(ValidationPipe)
	findAll(
		@GetUser() user: User,
		@Query() query: FindAllTransactionsQueryParams,
	): Promise<TransactionResponseApiResponseDto[]> {
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
	@ApiOperation({ summary: 'Get transaction by id' })
	findOne(@Param('id', ValidationPipe) id: string, @GetUser() user: User) {
		return this.transactionsService.findOne(id, user);
	}

	@Put(':id')
	@ApiOperation({ summary: 'Update transaction by id' })
	@UsePipes(ValidationPipe)
	update(
		@Param('id') id: string,
		@Body() updateTransactionDto: UpdateTransactionDto,
		@GetUser() user: User,
	) {
		return this.transactionsService.update(id, updateTransactionDto, user);
	}

	@Delete(':id')
	@ApiOperation({ summary: 'Delete transaction by id' })
	remove(@Param('id') id: string, @GetUser() user: User) {
		return this.transactionsService.remove(id, user);
	}
}
