import { SchedulingLinkEntity } from '@/types'
import faker from 'faker'

export default class SchedulingLinkFactory {
  public static createEntity(): SchedulingLinkEntity {
    return {
      booking_url: faker.internet.url(),
      owner: faker.internet.url(),
      owner_type: 'EventType'
    }
  }
}