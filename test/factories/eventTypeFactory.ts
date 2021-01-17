import { EventTypeEntity } from 'src/types'
import faker from 'faker'

export default class EventTypeFactory {
  static createEntity(): EventTypeEntity {
    return {
      uri: faker.internet.url(),
      name: faker.name.firstName(),
      active: faker.random.boolean(),
      slug: faker.lorem.word(),
      scheduling_url: faker.internet.url(),
      duration: faker.random.number({ min: 15, max: 60 }),
      kind: faker.random.arrayElement(['solo','group']),
      pooling_type: faker.random.arrayElement(['round robin', 'collective']),
      type: faker.random.arrayElement(['AdhocEventType', 'StandardEventType']),
      color: `#${faker.random.hexaDecimal(6)}`,
      created_at: faker.date.recent(100).toJSON(),
      updated_at: faker.date.recent(100).toJSON(),
      internal_note: faker.lorem.sentence(),
      description_plain: faker.lorem.sentence(),
      description_html: faker.lorem.sentence(),
      profile: {
        type: faker.random.arrayElement(['user', 'team']),
        name: faker.name.firstName(),
        owner: faker.internet.url()
      },
      secret: faker.random.boolean()
    }
  }
}