import { Test } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';
import { UserRepository } from './user.respository';
import { User } from './user.entity';
import { UnauthorizedException } from '@nestjs/common';

const mockRespository = () => ({
  findOneBy: jest.fn(),
});

describe('JwtStrategy', () => {
  let userRepository;
  let jwtStrategy;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        { provide: UserRepository, useFactory: mockRespository },
      ],
    }).compile();

    jwtStrategy = await module.get<JwtStrategy>(JwtStrategy);
    userRepository = await module.get<UserRepository>(UserRepository);
  });

  describe('validate', () => {
    it('return user if authorized', async () => {
      const user = new User();
      user.username = 'testUsername';
      userRepository.findOneBy.mockResolvedValue(user);
      const result = await jwtStrategy.validate({ username: 'testUsername' });
      expect(userRepository.findOneBy).toHaveBeenCalledWith({
        username: 'testUsername',
      });
      expect(result).toMatchObject(user);
    });

    it('throw exception for unauthorized user', () => {
      userRepository.findOneBy.mockResolvedValue(null);
      expect(
        jwtStrategy.validate({ username: 'testUsername' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
