import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.respository';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(private userRepository: UserRepository) {}

  signUp(authDto: AuthDto) {
    return this.userRepository.signUp(authDto);
  }
}
