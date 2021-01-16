import faker from 'faker'
import { InviteeFactory, TokenFactory } from '../factories'
import { Invitee, InviteeList, InviteeSort, InviteeStatus, Pagination, Token } from 'src/types'
import ScheduledEventInviteesClient from 'src/clients/scheduledEventInviteesClient'
import nock from 'nock'
import CalendlyError from 'src/errors/calendlyError'

const token: Token = TokenFactory.create()
const scheduledEventUuid = faker.random.uuid()

const client = new ScheduledEventInviteesClient(token, scheduledEventUuid)

it('creates new calendly client', () => {
  expect(client).toBeInstanceOf(ScheduledEventInviteesClient)
})

describe('.get', () => {
  describe('when response status is ok', () => {
    const uuid = faker.random.alphaNumeric(8)
    const inviteeEntity = InviteeFactory.createEntity()

    beforeAll(() => {
      nock(`https://api.calendly.com/scheduled_events/${scheduledEventUuid}`, {
        reqheaders: {
          authorization: `${token.tokenType} ${token.accessToken}`
        }
      }).get(`/invitees/${uuid}`)
      .reply(200, { resource: inviteeEntity })
    })

    it('returns a promise that resolves to expected result', async () => {
      const result = client.get(uuid)

      await expect(result).resolves.toEqual<Invitee>({
        uri: inviteeEntity.uri,
        email: inviteeEntity.email,
        name: inviteeEntity.name,
        status: inviteeEntity.status as InviteeStatus,
        questionsAndAnswers: inviteeEntity.questions_and_answers,
        timezone: inviteeEntity.timezone,
        event: inviteeEntity.event,
        createdAt: new Date(inviteeEntity.created_at),
        updatedAt: new Date(inviteeEntity.updated_at),
        tracking: {
          utmCampaign: inviteeEntity.tracking.utm_campaign,
          utmSource: inviteeEntity.tracking.utm_source,
          utmMedium: inviteeEntity.tracking.utm_medium,
          utmContent: inviteeEntity.tracking.utm_content,
          utmTerm: inviteeEntity.tracking.utm_term,
          salesforceUuid: inviteeEntity.tracking.salesforce_uuid
        },
        textReminderNumber: inviteeEntity.text_reminder_number,
        rescheduled: inviteeEntity.rescheduled,
        oldInvitee: inviteeEntity.old_invitee,
        newInvitee: inviteeEntity.new_invitee,
        cancelUrl: inviteeEntity.cancel_url,
        rescheduleUrl: inviteeEntity.reschedule_url
      })
    })
  })

  describe('when response status is not ok', () => {
    const uuid = faker.random.alphaNumeric(8)
    const errorStatus = faker.random.arrayElement([400,401,403,404,500])
    const errorDetails = {
      name: 'Error',
      title: faker.lorem.word(),
      message: faker.lorem.sentence(),
      details: [
        {
          parameter: faker.lorem.word(),
          message: faker.lorem.sentence()
        },
        {
          parameter: faker.lorem.word(),
          message: faker.lorem.sentence()
        },
        {
          parameter: faker.lorem.word(),
          message: faker.lorem.sentence()
        }
      ]
    }

    beforeAll(() => {
      nock(`https://api.calendly.com/scheduled_events/${scheduledEventUuid}`, {
        reqheaders: {
          authorization: `${token.tokenType} ${token.accessToken}`
        }
      }).get(`/invitees/${uuid}`).reply(errorStatus, errorDetails)
    })

    it('returns a promise that rejects', async () => {
      let result: CalendlyError

      try {
        await client.get(uuid)
      } catch (e) {
        result = e as CalendlyError
      }

      expect(result.status).toEqual(errorStatus)
      expect(result.title).toEqual(errorDetails.title)
      expect(result.message).toEqual(errorDetails.message)
      expect(result.details).toEqual(errorDetails.details)
    })
  })
})

describe('.list', () => {
  describe('when response status is ok', () => {
    const pagination = {
      count: faker.random.number({ min: 1, max: 100 }),
      next_page: faker.internet.url()
    }
    const inviteeEntity1 = InviteeFactory.createEntity()
    const inviteeEntity2 = InviteeFactory.createEntity()
    const inviteeEntity3 = InviteeFactory.createEntity()

    beforeAll(() => {
      nock(`https://api.calendly.com/scheduled_events/${scheduledEventUuid}`, {
        reqheaders: {
          authorization: `${token.tokenType} ${token.accessToken}`
        }
      }).get('/invitees')
        .reply(200, {
          collection: [
            inviteeEntity1,
            inviteeEntity2,
            inviteeEntity3
          ],
          pagination
        })
    })

    it('returns a promise that resolves to expected result', async () => {
      const result: InviteeList = await client.list()

      expect(result.pagination).toEqual<Pagination>({
        count: pagination.count,
        nextPage: pagination.next_page
      })

      expect(result.collection).toEqual<Invitee[]>([
        {
          uri: inviteeEntity1.uri,
          email: inviteeEntity1.email,
          name: inviteeEntity1.name,
          status: inviteeEntity1.status as InviteeStatus,
          questionsAndAnswers: inviteeEntity1.questions_and_answers,
          timezone: inviteeEntity1.timezone,
          event: inviteeEntity1.event,
          createdAt: new Date(inviteeEntity1.created_at),
          updatedAt: new Date(inviteeEntity1.updated_at),
          tracking: {
            utmCampaign: inviteeEntity1.tracking.utm_campaign,
            utmSource: inviteeEntity1.tracking.utm_source,
            utmMedium: inviteeEntity1.tracking.utm_medium,
            utmContent: inviteeEntity1.tracking.utm_content,
            utmTerm: inviteeEntity1.tracking.utm_term,
            salesforceUuid: inviteeEntity1.tracking.salesforce_uuid
          },
          textReminderNumber: inviteeEntity1.text_reminder_number,
          rescheduled: inviteeEntity1.rescheduled,
          oldInvitee: inviteeEntity1.old_invitee,
          newInvitee: inviteeEntity1.new_invitee,
          cancelUrl: inviteeEntity1.cancel_url,
          rescheduleUrl: inviteeEntity1.reschedule_url
        },
        {
          uri: inviteeEntity2.uri,
          email: inviteeEntity2.email,
          name: inviteeEntity2.name,
          status: inviteeEntity2.status as InviteeStatus,
          questionsAndAnswers: inviteeEntity2.questions_and_answers,
          timezone: inviteeEntity2.timezone,
          event: inviteeEntity2.event,
          createdAt: new Date(inviteeEntity2.created_at),
          updatedAt: new Date(inviteeEntity2.updated_at),
          tracking: {
            utmCampaign: inviteeEntity2.tracking.utm_campaign,
            utmSource: inviteeEntity2.tracking.utm_source,
            utmMedium: inviteeEntity2.tracking.utm_medium,
            utmContent: inviteeEntity2.tracking.utm_content,
            utmTerm: inviteeEntity2.tracking.utm_term,
            salesforceUuid: inviteeEntity2.tracking.salesforce_uuid
          },
          textReminderNumber: inviteeEntity2.text_reminder_number,
          rescheduled: inviteeEntity2.rescheduled,
          oldInvitee: inviteeEntity2.old_invitee,
          newInvitee: inviteeEntity2.new_invitee,
          cancelUrl: inviteeEntity2.cancel_url,
          rescheduleUrl: inviteeEntity2.reschedule_url
        },
        {
          uri: inviteeEntity3.uri,
          email: inviteeEntity3.email,
          name: inviteeEntity3.name,
          status: inviteeEntity3.status as InviteeStatus,
          questionsAndAnswers: inviteeEntity3.questions_and_answers,
          timezone: inviteeEntity3.timezone,
          event: inviteeEntity3.event,
          createdAt: new Date(inviteeEntity3.created_at),
          updatedAt: new Date(inviteeEntity3.updated_at),
          tracking: {
            utmCampaign: inviteeEntity3.tracking.utm_campaign,
            utmSource: inviteeEntity3.tracking.utm_source,
            utmMedium: inviteeEntity3.tracking.utm_medium,
            utmContent: inviteeEntity3.tracking.utm_content,
            utmTerm: inviteeEntity3.tracking.utm_term,
            salesforceUuid: inviteeEntity3.tracking.salesforce_uuid
          },
          textReminderNumber: inviteeEntity3.text_reminder_number,
          rescheduled: inviteeEntity3.rescheduled,
          oldInvitee: inviteeEntity3.old_invitee,
          newInvitee: inviteeEntity3.new_invitee,
          cancelUrl: inviteeEntity3.cancel_url,
          rescheduleUrl: inviteeEntity3.reschedule_url
        }
      ])
    })

    describe('when count is provided', () => {
      const count = faker.random.number({ min: 1, max: 20 })

      beforeAll(() => {
        nock(`https://api.calendly.com/scheduled_events/${scheduledEventUuid}`, {
          reqheaders: {
            authorization: `${token.tokenType} ${token.accessToken}`
          }
        }).get('/invitees')
          .query({ count })
          .reply(200, {
            collection: [
              inviteeEntity1
            ],
            pagination
          })
      })

      it('returns a promise that resolves to expected result', async () => {
        const result: InviteeList = await client.list({ count })
  
        expect(result.pagination).toEqual<Pagination>({
          count: pagination.count,
          nextPage: pagination.next_page
        })
  
        expect(result.collection).toEqual<Invitee[]>([
          {
            uri: inviteeEntity1.uri,
            email: inviteeEntity1.email,
            name: inviteeEntity1.name,
            status: inviteeEntity1.status as InviteeStatus,
            questionsAndAnswers: inviteeEntity1.questions_and_answers,
            timezone: inviteeEntity1.timezone,
            event: inviteeEntity1.event,
            createdAt: new Date(inviteeEntity1.created_at),
            updatedAt: new Date(inviteeEntity1.updated_at),
            tracking: {
              utmCampaign: inviteeEntity1.tracking.utm_campaign,
              utmSource: inviteeEntity1.tracking.utm_source,
              utmMedium: inviteeEntity1.tracking.utm_medium,
              utmContent: inviteeEntity1.tracking.utm_content,
              utmTerm: inviteeEntity1.tracking.utm_term,
              salesforceUuid: inviteeEntity1.tracking.salesforce_uuid
            },
            textReminderNumber: inviteeEntity1.text_reminder_number,
            rescheduled: inviteeEntity1.rescheduled,
            oldInvitee: inviteeEntity1.old_invitee,
            newInvitee: inviteeEntity1.new_invitee,
            cancelUrl: inviteeEntity1.cancel_url,
            rescheduleUrl: inviteeEntity1.reschedule_url
          }
        ])
      })

      describe('when email is provided', () => {
        const email = faker.internet.email()
  
        beforeAll(() => {
          nock(`https://api.calendly.com/scheduled_events/${scheduledEventUuid}`, {
            reqheaders: {
              authorization: `${token.tokenType} ${token.accessToken}`
            }
          }).get('/invitees')
            .query({ count, email })
            .reply(200, {
              collection: [
                inviteeEntity1
              ],
              pagination
            })
        })
  
        it('returns a promise that resolves to expected result', async () => {
          const result: InviteeList = await client.list({ count, email })
    
          expect(result.pagination).toEqual<Pagination>({
            count: pagination.count,
            nextPage: pagination.next_page
          })
    
          expect(result.collection).toEqual<Invitee[]>([
            {
              uri: inviteeEntity1.uri,
              email: inviteeEntity1.email,
              name: inviteeEntity1.name,
              status: inviteeEntity1.status as InviteeStatus,
              questionsAndAnswers: inviteeEntity1.questions_and_answers,
              timezone: inviteeEntity1.timezone,
              event: inviteeEntity1.event,
              createdAt: new Date(inviteeEntity1.created_at),
              updatedAt: new Date(inviteeEntity1.updated_at),
              tracking: {
                utmCampaign: inviteeEntity1.tracking.utm_campaign,
                utmSource: inviteeEntity1.tracking.utm_source,
                utmMedium: inviteeEntity1.tracking.utm_medium,
                utmContent: inviteeEntity1.tracking.utm_content,
                utmTerm: inviteeEntity1.tracking.utm_term,
                salesforceUuid: inviteeEntity1.tracking.salesforce_uuid
              },
              textReminderNumber: inviteeEntity1.text_reminder_number,
              rescheduled: inviteeEntity1.rescheduled,
              oldInvitee: inviteeEntity1.old_invitee,
              newInvitee: inviteeEntity1.new_invitee,
              cancelUrl: inviteeEntity1.cancel_url,
              rescheduleUrl: inviteeEntity1.reschedule_url
            }
          ])
        })

        describe('when page token is provided', () => {
          const pageToken = faker.random.uuid()
    
          beforeAll(() => {
            nock(`https://api.calendly.com/scheduled_events/${scheduledEventUuid}`, {
              reqheaders: {
                authorization: `${token.tokenType} ${token.accessToken}`
              }
            }).get('/invitees')
              .query({ count, email, page_token: pageToken })
              .reply(200, {
                collection: [
                  inviteeEntity1
                ],
                pagination
              })
          })
    
          it('returns a promise that resolves to expected result', async () => {
            const result: InviteeList = await client.list({ count, email, pageToken })
      
            expect(result.pagination).toEqual<Pagination>({
              count: pagination.count,
              nextPage: pagination.next_page
            })
      
            expect(result.collection).toEqual<Invitee[]>([
              {
                uri: inviteeEntity1.uri,
                email: inviteeEntity1.email,
                name: inviteeEntity1.name,
                status: inviteeEntity1.status as InviteeStatus,
                questionsAndAnswers: inviteeEntity1.questions_and_answers,
                timezone: inviteeEntity1.timezone,
                event: inviteeEntity1.event,
                createdAt: new Date(inviteeEntity1.created_at),
                updatedAt: new Date(inviteeEntity1.updated_at),
                tracking: {
                  utmCampaign: inviteeEntity1.tracking.utm_campaign,
                  utmSource: inviteeEntity1.tracking.utm_source,
                  utmMedium: inviteeEntity1.tracking.utm_medium,
                  utmContent: inviteeEntity1.tracking.utm_content,
                  utmTerm: inviteeEntity1.tracking.utm_term,
                  salesforceUuid: inviteeEntity1.tracking.salesforce_uuid
                },
                textReminderNumber: inviteeEntity1.text_reminder_number,
                rescheduled: inviteeEntity1.rescheduled,
                oldInvitee: inviteeEntity1.old_invitee,
                newInvitee: inviteeEntity1.new_invitee,
                cancelUrl: inviteeEntity1.cancel_url,
                rescheduleUrl: inviteeEntity1.reschedule_url
              }
            ])
          })

          describe('when sort is provided', () => {
            const sort = faker.random.arrayElement(['created_at:asc', 'created_at:desc']) as InviteeSort
      
            beforeAll(() => {
              nock(`https://api.calendly.com/scheduled_events/${scheduledEventUuid}`, {
                reqheaders: {
                  authorization: `${token.tokenType} ${token.accessToken}`
                }
              }).get('/invitees')
                .query({ count, email, page_token: pageToken, sort })
                .reply(200, {
                  collection: [ inviteeEntity1 ],
                  pagination
                })
            })
      
            it('returns a promise that resolves to expected result', async () => {
              const result: InviteeList = await client.list({ count, email, pageToken, sort })
        
              expect(result.pagination).toEqual<Pagination>({
                count: pagination.count,
                nextPage: pagination.next_page
              })
        
              expect(result.collection).toEqual<Invitee[]>([
                {
                  uri: inviteeEntity1.uri,
                  email: inviteeEntity1.email,
                  name: inviteeEntity1.name,
                  status: inviteeEntity1.status as InviteeStatus,
                  questionsAndAnswers: inviteeEntity1.questions_and_answers,
                  timezone: inviteeEntity1.timezone,
                  event: inviteeEntity1.event,
                  createdAt: new Date(inviteeEntity1.created_at),
                  updatedAt: new Date(inviteeEntity1.updated_at),
                  tracking: {
                    utmCampaign: inviteeEntity1.tracking.utm_campaign,
                    utmSource: inviteeEntity1.tracking.utm_source,
                    utmMedium: inviteeEntity1.tracking.utm_medium,
                    utmContent: inviteeEntity1.tracking.utm_content,
                    utmTerm: inviteeEntity1.tracking.utm_term,
                    salesforceUuid: inviteeEntity1.tracking.salesforce_uuid
                  },
                  textReminderNumber: inviteeEntity1.text_reminder_number,
                  rescheduled: inviteeEntity1.rescheduled,
                  oldInvitee: inviteeEntity1.old_invitee,
                  newInvitee: inviteeEntity1.new_invitee,
                  cancelUrl: inviteeEntity1.cancel_url,
                  rescheduleUrl: inviteeEntity1.reschedule_url
                }
              ])
            })

            describe('when status is provided', () => {
              const status = faker.random.arrayElement(['active', 'canceled']) as InviteeStatus
        
              beforeAll(() => {
                nock(`https://api.calendly.com/scheduled_events/${scheduledEventUuid}`, {
                  reqheaders: {
                    authorization: `${token.tokenType} ${token.accessToken}`
                  }
                }).get('/invitees')
                  .query({ count, email, page_token: pageToken, sort, status })
                  .reply(200, {
                    collection: [ inviteeEntity1 ],
                    pagination
                  })
              })
        
              it('returns a promise that resolves to expected result', async () => {
                const result: InviteeList = await client.list({ count, email, pageToken, sort, status })
          
                expect(result.pagination).toEqual<Pagination>({
                  count: pagination.count,
                  nextPage: pagination.next_page
                })
          
                expect(result.collection).toEqual<Invitee[]>([
                  {
                    uri: inviteeEntity1.uri,
                    email: inviteeEntity1.email,
                    name: inviteeEntity1.name,
                    status: inviteeEntity1.status as InviteeStatus,
                    questionsAndAnswers: inviteeEntity1.questions_and_answers,
                    timezone: inviteeEntity1.timezone,
                    event: inviteeEntity1.event,
                    createdAt: new Date(inviteeEntity1.created_at),
                    updatedAt: new Date(inviteeEntity1.updated_at),
                    tracking: {
                      utmCampaign: inviteeEntity1.tracking.utm_campaign,
                      utmSource: inviteeEntity1.tracking.utm_source,
                      utmMedium: inviteeEntity1.tracking.utm_medium,
                      utmContent: inviteeEntity1.tracking.utm_content,
                      utmTerm: inviteeEntity1.tracking.utm_term,
                      salesforceUuid: inviteeEntity1.tracking.salesforce_uuid
                    },
                    textReminderNumber: inviteeEntity1.text_reminder_number,
                    rescheduled: inviteeEntity1.rescheduled,
                    oldInvitee: inviteeEntity1.old_invitee,
                    newInvitee: inviteeEntity1.new_invitee,
                    cancelUrl: inviteeEntity1.cancel_url,
                    rescheduleUrl: inviteeEntity1.reschedule_url
                  }
                ])
              })
            })
          })
        })
      })
    })
  })

  describe('when response status is not okay', () => {
    const errorStatus = faker.random.arrayElement([400,401,403,404,500])
    const errorDetails = {
      name: 'Error',
      title: faker.lorem.word(),
      message: faker.lorem.sentence(),
      details: [
        {
          parameter: faker.lorem.word(),
          message: faker.lorem.sentence()
        },
        {
          parameter: faker.lorem.word(),
          message: faker.lorem.sentence()
        },
        {
          parameter: faker.lorem.word(),
          message: faker.lorem.sentence()
        }
      ]
    }

    beforeAll(() => {
      nock(`https://api.calendly.com/scheduled_events/${scheduledEventUuid}`, {
        reqheaders: {
          authorization: `${token.tokenType} ${token.accessToken}`
        }
      })
      .get('/invitees')
      .reply(errorStatus, errorDetails)
    })

    it('returns a promise that rejects', async () => {
      let result: CalendlyError

      try {
        await client.list()
      } catch (e) {
        result = e as CalendlyError
      }

      expect(result.status).toEqual(errorStatus)
      expect(result.title).toEqual(errorDetails.title)
      expect(result.message).toEqual(errorDetails.message)
      expect(result.details).toEqual(errorDetails.details)
    })
  })
})