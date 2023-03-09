import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Budget } from 'src/modules/budgets/entities/budget.entity';
import { Category } from 'src/modules/categories/entities/category.entity';
import { Role } from 'src/modules/roles/entities/role.entity';
import { RefreshToken } from 'src/modules/tokens/entities/refresh-token.entity';
import { Transaction } from 'src/modules/transactions/entities/transaction.entity';
import { User } from 'src/modules/users/entities/user.entity';

export const typeOrmConfigFactory = async (
	configService: ConfigService,
): Promise<TypeOrmModuleOptions> => ({
	type: 'postgres',
	host: configService.get<string>('DATABASE_HOST') ?? '',
	port: Number(configService.get<string>('DATABASE_PORT')) ?? 3000,
	username: configService.get<string>('DATABASE_USERNAME') ?? '',
	password: configService.get<string>('DATABASE_PASSWORD') ?? '',
	database: 'postgres',
	entities: [Transaction, User, Role, Budget, Category, RefreshToken],
	//   TODO: remove in production
	synchronize: Boolean(configService.get<string>('DATABASE_SYNCHRONIZE')),
});

// https://app.supabase.com/project/kvnvxewlifksjoxufhst/settings/billing/subscription
// 500mb for free tier
// https://api.elephantsql.com/console/a4384aba-eac1-4fdb-b9c5-e21393a96e21/details
// 20mb
