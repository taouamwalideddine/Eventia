import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/services/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  /**
   * Validates the JWT payload and retrieves the associated user.
   * @param payload The decoded JWT payload.
   */
  async validate(payload: any) {
    try {
      const user = await this.usersService.findById(payload.sub);
      return {
        userId: user.id,
        email: user.email,
        role: user.role,
      };
    } catch (error) {
      throw error;
    }
  }
}
