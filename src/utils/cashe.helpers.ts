import { User } from 'src/modules/users/entities/user.entity';

export const createUserTokenCacheKey = (user: User) =>
	`${user.userEmail}AccessToken`;
