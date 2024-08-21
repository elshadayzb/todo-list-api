import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './user.respository';
import { AuthDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  signUp(authDto: AuthDto) {
    return this.userRepository.signUp(authDto);
  }

  async signIn(authDto: AuthDto) {
    const username = await this.userRepository.validateUser(authDto);
    if (!username) {
      throw new UnauthorizedException('Invalid Credentials');
    }

    const payload: JwtPayload = { username };
    const token = this.jwtService.sign(payload);

    return token;
  }
}
