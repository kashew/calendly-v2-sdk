import { Token } from 'src/types'
import faker from 'faker'

export default class TokenFactory {
  static create(): Token {
    return {
      accessToken: faker.random.uuid(),
      createdAt: faker.date.recent(100),
      expiresIn: faker.random.number({ min: 1, max: 7200 }),
      organization: faker.internet.url(),
      owner: faker.internet.url(),
      refreshToken: faker.random.uuid(),
      scope: 'default',
      tokenType: 'Bearer'
    }
  }
}