import { CacheModule, Module } from '@nestjs/common';
import { UsersModule  } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { TransactionsModule } from './transactions/transactions.module';
import { typeOrmConfig } from './config/typeorm.config';
import { TypeOrmModule } from '@nestjs/typeorm/dist';
import { AuthModule } from './auth/auth.module';
import { RolesModule } from './roles/roles.module';
import { BudgetsModule } from './budgets/budgets.module';
import { CategoriesModule } from './categories/categories.module';

// TODO: type all the returned values from controllers and adjust returned values
// TODO: add config module
// TODO: add logging
// TODO: add tests
// TODO: Add swagger
// TODO: add cors and HELMET headers
// TODO: Add compression
// TODO: consider file uploads

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(typeOrmConfig),
    // TODO: move to cache Config
    CacheModule.register({
      ttl: 0,
      isGlobal: true,
    }),
    UsersModule,
    AuthModule,
    TransactionsModule,
    RolesModule,
    BudgetsModule,
    CategoriesModule,
  ],
})
export class AppModule {}
