import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

describe('UserEntity', () => {
  let user;

  beforeEach(() => {
    user = new User();
    (user.password = 'testPassword'), (user.salt = 'testSalt');
    bcrypt.hash = jest.fn();
  });

  it('validate correct passoword', async () => {
    bcrypt.hash.mockReturnValue('testPassword');
    const result = await user.validatePassword('12345');
    expect(bcrypt.hash).toHaveBeenCalledWith('12345', 'testSalt');
    expect(result).toBe(true);
  });

  it('validate correct passoword', async () => {
    bcrypt.hash.mockReturnValue('P@ssw0rd');
    const result = await user.validatePassword('password');
    expect(bcrypt.hash).toHaveBeenCalledWith('password', 'testSalt');
    expect(result).toBe(false);
  });
});
