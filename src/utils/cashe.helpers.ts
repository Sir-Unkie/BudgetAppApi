import { User } from "src/users/entities/user.entity";

export const createUserTokenCacheKey = (user: User) =>
	`${user.userEmail}AccessToken`;
