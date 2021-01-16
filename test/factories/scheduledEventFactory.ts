import faker from 'faker';
import { LocationFactory } from '.';
import { EventMembership, LocationType, ScheduledEventEntity } from '../../src/types';

export default class ScheduledEventFactory {
  public static createEntity(locationType?: LocationType): ScheduledEventEntity {
    return {
      uri: faker.internet.url(),
      name: faker.lorem.word(),
      status: faker.random.arrayElement(['active', 'canceled']),
      start_time: JSON.stringify(faker.date.recent(100)),
      end_time: JSON.stringify(faker.date.recent(100)),
      event_type: faker.internet.url(),
      location: LocationFactory.createEntity(locationType),
      invitees_counter: {
        total: faker.random.number({ min: 1, max: 100 }),
        active: faker.random.number({ min: 1, max: 100 }),
        limit: faker.random.number({ min: 1, max: 100 })
      },
      created_at: JSON.stringify(faker.date.recent(100)),
      updated_at: JSON.stringify(faker.date.recent(100)),
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