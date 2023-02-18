import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { RolesModule } from "src/roles/roles.module";
import { UsersModule } from "src/users/users.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { GoogleStrategy, JwtStrategy } from "./strategies";

@Module({
	imports: [
		JwtModule.register({
			// TODO: move to constants
			// secret: jwtConstants.secret,
			secret: "qweqehlsglkdfjg[iouertjkh",
			signOptions: { expiresIn: "160s" },
		}),
		UsersModule,
		RolesModule,
	],
	controllers: [AuthController],
	providers: [AuthService, JwtStrategy, GoogleStrategy],
	exports: [AuthService],
})
export class AuthModule {}
