import { EventMembership, LocationType, ScheduledEventEntity } from '@/types'
import { LocationFactory } from '.'
import faker from 'faker'

export default class ScheduledEventFactory {
  public static createEntity(locationType?: LocationType): ScheduledEventEntity {
    return {
      uri: faker.internet.url(),
      name: faker.lorem.word(),
      status: faker.random.arrayElement(['active', 'canceled']),
      start_time: faker.date.recent(100).toJSON(),
      end_time: faker.date.recent(100).toJSON(),
      event_type: faker.internet.url(),
      location: LocationFactory.createEntity(locationType),
      invitees_counter: {
        total: faker.random.number({ min: 1, max: 100 }),
        active: faker.random.number({ min: 1, max: 100 }),
        limit: faker.random.number({ min: 1, max: 100 })
      },
      created_at: faker.date.recent(100).toJSON(),
      updated_at: faker.date.recent(100).toJSON(),
      event_memberships: this.getRandomEventMemberships()
    }
  }

  private static getRandomEventMemberships(): EventMembership[] {
    return [
      {
        user: faker.internet.url()
      },
      {
        user: faker.internet.url()
      },
      {
        user: faker.internet.url()
      }
    ]
  }
}