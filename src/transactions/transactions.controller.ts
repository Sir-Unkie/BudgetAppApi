import {
	Controller,
	Get,
	Post,
	Body,
	Param,
	Delete,
	UsePipes,
	ValidationPipe,
	ParseIntPipe,
	Put,
	UseGuards,
	Query,
} from "@nestjs/common";
import { TransactionsService } from "./transactions.service";
import { CreateTransactionDto } from "./dto/create-transaction.dto";
import { UpdateTransactionDto } from "./dto/update-transaction.dto";
import { JwtAuthGuard } from "src/auth/guards";
import { GetUser } from "src/customDecorators/user.decorator";
import { User } from "src/users/entities/user.entity";
import { FindAllTransactionsQueryParams } from "./types";

@Controller("transactions")
@UseGuards(JwtAuthGuard)
export class TransactionsController {
	constructor(private readonly transactionsService: TransactionsService) {}

	@Post()
	@UsePipes(ValidationPipe)
	create(
		@Body() createTransactionDto: CreateTransactionDto,
		@GetUser() user: User,
	) {
		return this.transactionsService.create(createTransactionDto, user);
	}

	@Get()
	@UsePipes(ValidationPipe)
	findAll(
		@GetUser() user: User,
		@Query() query: FindAllTransactionsQueryParams,
	) {
		const { startDate, endDate } = query;
		return this.transactionsService.findAll(user, startDate, endDate);
	}

	@Get(":id")
	findOne(@Param("id", ParseIntPipe) id: number, @GetUser() user: User) { 
		return this.transactionsService.findOne(id, user);
	}

	@Put(":id")
	@UsePipes(ValidationPipe)
	update(
		@Param("id", ParseIntPipe) id: number,
		@Body() updateTransactionDto: UpdateTransactionDto,
		@GetUser() user: User,
	) {
		return this.transactionsService.update(id, updateTransactionDto, user);
	}

	@Delete(":id")
	remove(@Param("id", ParseIntPipe) id: number, @GetUser() user: User) {
		return this.transactionsService.remove(id, user);
	}
}
