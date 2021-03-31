import { WebhookPayloadEntity } from '@/types'
import { InviteeFactory } from './'
import faker from 'faker'

export default class WebhookPayloadFactory {
  public static createEntity(): WebhookPayloadEntity {
    return {
      event: faker.random.arrayElement(['invitee.created', 'invitee.canceled']),
      created_at: faker.date.recent(100).toJSON(),
      payload: InviteeFactory.createEntity()
    }
  }
}