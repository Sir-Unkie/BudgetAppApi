import { Module } from '@nestjs/common';
import { RolesModule } from 'src/modules/roles/roles.module';
import { TokensModule } from 'src/modules/tokens/tokens.module';
import { UsersModule } from 'src/modules/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleStrategy, JwtStrategy } from './strategies';

@Module({
	imports: [UsersModule, RolesModule, TokensModule],
	controllers: [AuthController],
	providers: [AuthService, JwtStrategy, GoogleStrategy],
	exports: [AuthService],
})
export class AuthModule {}
