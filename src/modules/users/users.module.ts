import { Module } from '@nestjs/common';
import { UserRepository } from './repositories/users.repository';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
	controllers: [UsersController],
	providers: [UserRepository, UsersService],
	exports: [UserRepository, UsersService],
})
export class UsersModule {}
