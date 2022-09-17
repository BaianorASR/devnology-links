import { Strategy } from 'passport-local';

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'emailOrName' });
  }

  async validate(emailOrName: string, password: string): Promise<any> {
    try {
      const user = await this.authService.validateUser(emailOrName, password);

      if (!user) throw new UnauthorizedException('Invalid credentials.');

      return user;
    } catch (error) {
      throw error;
    }
  }
}
