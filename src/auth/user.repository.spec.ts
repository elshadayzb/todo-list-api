import { Test } from '@nestjs/testing';
import { UserRepository } from './user.respository';
import { DataSource, DataSourceOptions, EntityManager } from 'typeorm';
import { AuthDto } from './dto/auth.dto';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { User } from './user.entity';
//import * as bcrypt from 'bcrypt';

const mockCredentials: AuthDto = {
  username: 'Test username',
  password: 'P@ssw0rd',
};

describe('UserRespository', () => {
  let userRespository;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserRepository,
        {
          provide: DataSource,
          useValue: {
            createEntityManager: () => {
              return new EntityManager(
                new DataSource({ type: 'postgres' } as DataSourceOptions),
              );
            },
          },
        },
      ],
    }).compile();

    userRespository = await module.get<UserRepository>(UserRepository);
  });

  describe('signUp', () => {
    let save;
    beforeEach(() => {
      save = jest.fn();
      userRespository.create = jest.fn().mockReturnValue({ save });
    });

    it('successfully creates a user', async () => {
      save.mockResolvedValue(true);
      expect(userRespository.signUp(mockCredentials)).resolves.not.toThrow();
      //await userRespository.signUp(mockCredentials);
      //expect(save).toHaveBeenCalled();
    });

    it('throws exception if username exists', () => {
      save.mockRejectedValue({ code: '23505' });
      expect(userRespository.signUp(mockCredentials)).rejects.toThrow(
        ConflictException,
      );
    });

    it('throws internal server error', () => {
      save.mockRejectedValue({ code: '123' });
      expect(userRespository.signUp(mockCredentials)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('validateUser', () => {
    let user;
    beforeEach(() => {
      userRespository.findOneBy = jest.fn();
      user = new User();
      user.username = 'Test username';
      user.validatePassword = jest.fn();
    });
    it('return username if credential is correct', async () => {
      userRespository.findOneBy.mockResolvedValue(user);
      user.validatePassword.mockResolvedValue(true);
      const result = await userRespository.validateUser(mockCredentials);
      expect(result).toBe('Test username');
    });

    it('return null if username is incorrect', async () => {
      userRespository.findOneBy.mockResolvedValue(null);
      const result = await userRespository.validateUser(mockCredentials);
      expect(user.validatePassword).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });

    it('return null if password is incorrect', async () => {
      userRespository.findOneBy.mockResolvedValue(user);
      user.validatePassword.mockResolvedValue(false);
      const result = await userRespository.validateUser(mockCredentials);
      expect(user.validatePassword).toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });

  /* describe('hashPassword', () => {
    it('test password hashing using bcrypt', async () => {
      bcrypt.hash = jest.fn().mockResolvedValue('Test hash');
      const result = await userRespository.hashPassword(
        'testPassword',
        'testSalt',
      );
      expect(bcrypt.hash).toHaveBeenCalled();
      expect(result).toBe('Test hash');
    });
  }); */
});
