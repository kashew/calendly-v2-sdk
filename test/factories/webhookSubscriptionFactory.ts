import { WebhookSubscriptionEntity } from '@/types'
import faker from 'faker'

export default class WebhookSubscriptionFactory {
  public static createEntity(): WebhookSubscriptionEntity {
    return {
      uri: faker.internet.url(),
      callback_url: faker.internet.url(),
      created_at: faker.date.recent(100).toJSON(),
      updated_at: faker.date.recent(100).toJSON(),
      retry_started_at: faker.date.recent(100).toJSON(),
      state: faker.random.arrayElement(['active', 'disabled']),
      events: [faker.random.arrayElement(['invitee.created', 'invitee.canceled'])],
      scope: faker.random.arrayElement(['organization', 'user']),
      organization: faker.internet.url(),
      user: faker.internet.url(),
      creator: faker.internet.url()
    }
  }
}