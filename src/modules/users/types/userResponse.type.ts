import { ERoles } from 'src/modules/roles/types/roles.enum';

export interface IUserApiResponse {
	id: number;
	role: ERoles;
	userEmail: string;
	displayName: string | null;
}
