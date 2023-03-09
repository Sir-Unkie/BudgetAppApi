import { CacheModule, Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { typeOrmConfigFactory } from './config/typeorm.config';
import { TypeOrmModule } from '@nestjs/typeorm/dist';
import { AuthModule } from './modules/auth/auth.module';
import { RolesModule } from './modules/roles/roles.module';
import { BudgetsModule } from './modules/budgets/budgets.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { TokensModule } from './modules/tokens/tokens.module';
import { cacheModuleConfig } from 'src/config/cacheModule.config';
import { configModuleConfig } from 'src/config/configModule.config';

// TODO: consider not allowing to login if already logged in?
// TODO: add logging
// TODO: add tests
// TODO: Add swagger
// TODO: add cors and HELMET headers
// TODO: Add compression
// TODO: consider file uploads
// TODO: try migrations

@Module({
	imports: [
		ConfigModule.forRoot(configModuleConfig),
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: typeOrmConfigFactory,
			inject: [ConfigService],
		}),
		CacheModule.register(cacheModuleConfig),
		UsersModule,
		AuthModule,
		TransactionsModule,
		RolesModule,
		BudgetsModule,
		CategoriesModule,
		TokensModule,
	],
})
export class AppModule {}
