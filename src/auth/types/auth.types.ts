import { ERoles } from "src/roles/types/roles.enum";

export interface IJwtPayload {
  id: number;
  email: string;
  role: ERoles;
}

export interface IJwtStrategyPayload extends IJwtPayload {
  iat: number;
  exp: number;
}

export type JwtToken = string; 