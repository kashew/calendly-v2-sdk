import { OrganizationInvitationEntity } from '@/types'
import faker from 'faker'

export default class OrganizationInvitationFactory {
  public static createEntity(): OrganizationInvitationEntity {
    return {
      uri: faker.internet.url(),
      organization: faker.internet.url(),
      email: faker.internet.email(),
      status: faker.random.arrayElement(['accepted', 'declined', 'pending']),
      created_at: faker.date.recent(100).toJSON(),
      updated_at: faker.date.recent(100).toJSON(),
      last_sent_at: faker.date.recent(100).toJSON(),
      user: faker.internet.url()
    }
  }
}