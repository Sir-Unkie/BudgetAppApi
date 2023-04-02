import { ERoles } from 'src/modules/roles/types/roles.enum';

export class UserApiResponseDto {
	/**
	 * Unique identifier
	 */
	id: number;

	/**
	 * User Role
	 */
	role: ERoles;

	/**
	 * User email
	 */
	userEmail: string;

	/**
	 * user display name
	 */
	displayName?: string;
}
