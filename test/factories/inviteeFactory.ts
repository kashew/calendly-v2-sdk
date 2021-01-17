import faker from 'faker'
import { InviteeEntity } from 'src/types'

export default class InviteeFactory {
  public static createEntity(): InviteeEntity {
    return {
      uri: faker.internet.url(),
      email: faker.internet.email(),
      name: faker.name.firstName(),
      status: faker.random.arrayElement(['active', 'canceled']),
      questions_and_answers: [
        {
          question: faker.lorem.sentence(),
          answer: faker.lorem.sentence(),
          position: 1
        },
        {
          question: faker.lorem.sentence(),
          answer: faker.lorem.sentence(),
          position: 2
        },
        {
          question: faker.lorem.sentence(),
          answer: faker.lorem.sentence(),
          position: 3
        }
      ],
      timezone: faker.address.timeZone(),
      event: faker.internet.url(),
      created_at: faker.date.recent(100).toJSON(),
      updated_at: faker.date.recent(100).toJSON(),
      tracking: {
        utm_campaign: faker.lorem.word(),
        utm_content: faker.lorem.word(),
        utm_medium: faker.lorem.word(),
        utm_source: faker.lorem.word(),
        utm_term: faker.lorem.word(),
        salesforce_uuid: faker.random.uuid()
      },
      text_reminder_number: faker.phone.phoneNumber(),
      rescheduled: faker.random.boolean(),
      old_invitee: faker.internet.url(),
      new_invitee: faker.internet.url(),
      cancel_url: faker.internet.url(),
      reschedule_url: faker.internet.url()
    }
  }
}