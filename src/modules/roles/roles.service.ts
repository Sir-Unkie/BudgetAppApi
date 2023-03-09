import { Injectable } from '@nestjs/common';
import { RolesRepository } from './repositories/roles.repository';

@Injectable()
export class RolesService {
	constructor(private readonly rolesRepository: RolesRepository) {}

	async findAll() {
		const allRoles = await this.rolesRepository.find();
		return allRoles;
	}
}
