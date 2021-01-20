import { UserEntity } from '@/types'
import faker from 'faker'

export default class UserFactory {
  public static createEntity(): UserEntity {
    return {
      uri: faker.internet.url(),
      name: faker.name.firstName(),
      slug: faker.lorem.word(),
      email: faker.internet.email(),
      scheduling_url: faker.internet.url(),
      timezone: faker.lorem.word(),
      avatar_url: faker.internet.url(),
      created_at: faker.date.recent(100).toJSON(),
      updated_at: faker.date.recent(100).toJSON()
    }
  }
}