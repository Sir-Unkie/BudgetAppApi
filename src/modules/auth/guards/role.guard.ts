import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { REQUEST_ROLES_METADATA_KEYROLES_KEY } from 'src/constants/requests-metadata-keys.constants';
import { ERoles } from 'src/modules/roles/types/roles.enum';
import { User } from 'src/modules/users/entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(private reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean {
		const requiredRoles = this.reflector.getAllAndOverride<ERoles[]>(
			REQUEST_ROLES_METADATA_KEYROLES_KEY,
			[context.getHandler(), context.getClass()],
		);

		if (!requiredRoles) {
			return true;
		}

		const request = context.switchToHttp().getRequest();
		const user = request.user as User;

		return requiredRoles.includes(user.role.roleName);
	}
}
