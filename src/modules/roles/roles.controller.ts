import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/guards';
import { RolesService } from './roles.service';
import { ROUTES } from 'src/constants/routes.constants';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags(ROUTES.ROLES)
@Controller(ROUTES.ROLES)
@UseGuards(JwtAuthGuard)
export class RolesController {
	constructor(private readonly rolesService: RolesService) {}

	@Get()
	@ApiOperation({ summary: 'Get all roles' })
	findAll() {
		return this.rolesService.findAll();
	}
}
