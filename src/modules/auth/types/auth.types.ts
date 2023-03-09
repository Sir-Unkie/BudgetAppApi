import { ERoles } from 'src/modules/roles/types/roles.enum';

export interface IJwtPayload {
	id: number;
	email: string;
	role: ERoles;
}

export interface IJwtPayloadWithTimes extends IJwtPayload {
	iat: number;
	exp: number;
}

export interface IJwtStrategyPayload extends IJwtPayload {
	iat: number;
	exp: number;
}

export type TJwtToken = string;

export interface IJwtTokens {
	accessToken: TJwtToken;
	refreshToken: TJwtToken;
}
