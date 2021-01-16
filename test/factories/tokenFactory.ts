import faker from 'faker';
import { Token } from '../../src/types';

export default class TokenFactory {
  static create(): Token {
    return {
      accessToken: faker.random.uuid(),
      createdAt: faker.random.number({ min: 1000000000, max: 9000000000 }),
      expiresIn: faker.random.number({ min: 1, max: 7200 }),
      organization: faker.internet.url(),
      owner: faker.internet.url(),
      refreshToken: faker.random.uuid(),
      scope: 'default',
      tokenType: 'Bearer'
    }
  }
}