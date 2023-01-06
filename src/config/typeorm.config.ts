import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { Transaction } from "src/transactions/entities/transaction.entity";
import { User } from "src/users/entities/user.entity";

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'db.kvnvxewlifksjoxufhst.supabase.co',
  port: 5432,
  username: 'postgres',
  password: 'oCjf9pzqKW8Ck4Xx',
  database: 'postgres',
  entities: [Transaction, User],
  //   TODO: remove in production
  synchronize: true, 
};

// https://app.supabase.com/project/kvnvxewlifksjoxufhst/settings/billing/subscription
// 500mb for free tier
// https://api.elephantsql.com/console/a4384aba-eac1-4fdb-b9c5-e21393a96e21/details
// 20mb