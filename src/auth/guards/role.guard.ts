import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from 'src/constants';
import { ERoles } from 'src/roles/types/roles.enum';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {

  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean {
    
    const requiredRoles = this.reflector.getAllAndOverride<ERoles[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    
    if (!requiredRoles) {
      return true;
    }
    console.log('requiredRoles: ', requiredRoles);

    const request = context.switchToHttp().getRequest();
    const user  = request.user as User;
    console.log('user: ', user);
    
    return requiredRoles.includes(user.role.roleName);
  }
}
