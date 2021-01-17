import faker from 'faker'
import { SchedulingLinkEntity } from 'src/types'

export default class SchedulingLinkFactory {
  public static createEntity(): SchedulingLinkEntity {
    return {
      booking_url: faker.internet.url(),
      owner: faker.internet.url(),
      owner_type: 'EventType'
    }
  }
}