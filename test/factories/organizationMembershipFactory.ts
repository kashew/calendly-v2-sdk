import { OrganizationMembershipEntity } from 'src/types'
import { UserFactory } from '.'
import faker from 'faker'

export default class OrganizationMembershipFactory {
  public static createEntity(): OrganizationMembershipEntity {
    return {
      uri: faker.internet.url(),
      role: faker.random.arrayElement(['owner', 'admin', 'user']),
      user: UserFactory.createEntity(),
      organization: faker.internet.url(),
      updated_at: faker.date.recent(100).toString(),
      created_at: faker.date.recent(100).toString()
    }
  }
}