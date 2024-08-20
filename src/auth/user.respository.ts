import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from './user.entity';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async signUp(authDto: AuthDto) {
    const { username, password } = authDto;

    const user = new User();
    user.username = username;
    user.password = password;
    await user.save();
  }
}
