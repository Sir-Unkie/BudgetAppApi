import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { CACHE_MANAGER, Inject, Injectable, UnauthorizedException  } from '@nestjs/common';
import { IJwtStrategyPayload } from '../types/auth.types';
import { User } from 'src/users/entities/user.entity';
import { UserRepository } from 'src/users/repositories/users.repository';
import { Request } from 'express';
import { Cache } from 'cache-manager';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  // TODO: add refreshToken logic and workflow
  constructor(
    private readonly usersRepository: UserRepository,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      passReqToCallback: true,
      // secretOrKey: jwtConstants.secret,
      // TODO: make constant
      secretOrKey: 'qweqehlsglkdfjg[iouertjkh',
    });
  }

  async validate(req: Request, payload: IJwtStrategyPayload): Promise<User> {
    const { email } = payload;
    const existingUser = await this.usersRepository.findOne({
      where: { userEmail: email },
      relations: { role: true },
    });

    if (!existingUser) {
      throw new UnauthorizedException();
    }
    // TODO: here we can add logic to check if the token is in the
    // white list (in cash), 
    const extractedTokenFromHeader = req.get('authorization')?.replace('Bearer', '').trim();
    if (!extractedTokenFromHeader) {
      throw new UnauthorizedException();
    }
    const tokenFromCache = await this.cacheManager.get(`${email}AccessToken`);
    if (tokenFromCache !== extractedTokenFromHeader) {
      throw new UnauthorizedException();
    }

    return existingUser;
  }
}