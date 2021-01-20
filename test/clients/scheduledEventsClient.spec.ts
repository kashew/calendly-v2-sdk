import {
  ConferenceStatus, CustomLocation, CustomLocationEntity, GoToMeetingConference,
  GoToMeetingConferenceEntity, GoogleConference, GoogleConferenceEntity,
  InPersonMeeting, InPersonMeetingEntity, InboundCall, InboundCallEntity,
  InviteeSpecifiedLocation, InviteeSpecifiedLocationEntity, LocationType,
  MicrosoftTeamsConference, MicrosoftTeamsConferenceEntity, OutboundCall,
  OutboundCallEntity, Pagination, ScheduledEvent, ScheduledEventList,
  ScheduledEventSort, ScheduledEventStatus, Token, ZoomConference, ZoomConferenceEntity
} from '@/types'
import { ScheduledEventFactory, TokenFactory } from '../factories'
import CalendlyError from '@/errors/calendlyError'
import ScheduledEventsClient from '@/clients/scheduledEventsClient'
import faker from 'faker'
import nock from 'nock'

const token: Token = TokenFactory.create()

const client = new ScheduledEventsClient(token)

it('creates new calendly client', () => {
  expect(client).toBeInstanceOf(ScheduledEventsClient)
})

describe('.get', () => {
  describe('when response status is ok', () => {
    const uuid = faker.random.alphaNumeric(8)

    describe('when the location is custom', () => {
      const scheduledEventEntity = ScheduledEventFactory.createEntity(LocationType.Custom)

      beforeAll(() => {
        nock('https://api.calendly.com', {
          reqheaders: {
            authorization: `${token.tokenType} ${token.accessToken}`
          }
        }).get(`/scheduled_events/${uuid}`)
        .reply(200, { resource: scheduledEventEntity })
      })

      it('returns a promise that resolves to expected result', async () => {
        const result = await client.get(uuid)
        const locationEntity = scheduledEventEntity.location as CustomLocationEntity

        expect(result).toEqual<ScheduledEvent>({
          uri: scheduledEventEntity.uri,
          name: scheduledEventEntity.name,
          status: scheduledEventEntity.status as ScheduledEventStatus,
          startTime: new Date(scheduledEventEntity.start_time),
          endTime: new Date(scheduledEventEntity.end_time),
          eventType: scheduledEventEntity.event_type,
          location: {
            type: LocationType.Custom,
            location: locationEntity.location
          },
          inviteesCounter: scheduledEventEntity.invitees_counter,
          createdAt: new Date(scheduledEventEntity.created_at),
          updatedAt: new Date(scheduledEventEntity.updated_at),
          eventMemberships: scheduledEventEntity.event_memberships
        })

        expect(result.location).toEqual<CustomLocation>({
          type: LocationType.Custom,
          location: locationEntity.location
        })
      })
    })

    describe('when the location is gotomeeting conference', () => {
      const scheduledEventEntity = ScheduledEventFactory.createEntity(LocationType.GoToMeetingConference)

      beforeAll(() => {
        nock('https://api.calendly.com', {
          reqheaders: {
            authorization: `${token.tokenType} ${token.accessToken}`
          }
        }).get(`/scheduled_events/${uuid}`)
        .reply(200, { resource: scheduledEventEntity })
      })

      it('returns a promise that resolves to expected result', async () => {
        const result = await client.get(uuid)
        const locationEntity = scheduledEventEntity.location as GoToMeetingConferenceEntity

        expect(result.location).toEqual<GoToMeetingConference>({
          type: LocationType.GoToMeetingConference,
          status: locationEntity.status as ConferenceStatus,
          joinUrl: locationEntity.join_url,
          data: locationEntity.data
        })
      })
    })

    describe('when the location is google conference', () => {
      const scheduledEventEntity = ScheduledEventFactory.createEntity(LocationType.GoogleConference)

      beforeAll(() => {
        nock('https://api.calendly.com', {
          reqheaders: {
            authorization: `${token.tokenType} ${token.accessToken}`
          }
        }).get(`/scheduled_events/${uuid}`)
        .reply(200, { resource: scheduledEventEntity })
      })

      it('returns a promise that resolves to expected result', async () => {
        const result = await client.get(uuid)
        const locationEntity = scheduledEventEntity.location as GoogleConferenceEntity

        expect(result.location).toEqual<GoogleConference>({
          type: LocationType.GoogleConference,
          status: locationEntity.status,
          joinUrl: locationEntity.join_url
        })
      })
    })

    describe('when the location is in person meeting', () => {
      const scheduledEventEntity = ScheduledEventFactory.createEntity(LocationType.InPersonMeeting)

      beforeAll(() => {
        nock('https://api.calendly.com', {
          reqheaders: {
            authorization: `${token.tokenType} ${token.accessToken}`
          }
        }).get(`/scheduled_events/${uuid}`)
        .reply(200, { resource: scheduledEventEntity })
      })

      it('returns a promise that resolves to expected result', async () => {
        const result = await client.get(uuid)
        const locationEntity = scheduledEventEntity.location as InPersonMeetingEntity

        expect(result.location).toEqual<InPersonMeeting>({
          type: LocationType.InPersonMeeting,
          location: locationEntity.location
        })
      })
    })

    describe('when the location is inbound call', () => {
      const scheduledEventEntity = ScheduledEventFactory.createEntity(LocationType.InboundCall)

      beforeAll(() => {
        nock('https://api.calendly.com', {
          reqheaders: {
            authorization: `${token.tokenType} ${token.accessToken}`
          }
        }).get(`/scheduled_events/${uuid}`)
        .reply(200, { resource: scheduledEventEntity })
      })

      it('returns a promise that resolves to expected result', async () => {
        const result = await client.get(uuid)
        const locationEntity = scheduledEventEntity.location as InboundCallEntity

        expect(result.location).toEqual<InboundCall>({
          type: LocationType.InboundCall,
          location: locationEntity.location
        })
      })
    })

    describe('when the location is invitee specified', () => {
      const scheduledEventEntity = ScheduledEventFactory.createEntity(LocationType.InviteeSpecified)

      beforeAll(() => {
        nock('https://api.calendly.com', {
          reqheaders: {
            authorization: `${token.tokenType} ${token.accessToken}`
          }
        }).get(`/scheduled_events/${uuid}`)
        .reply(200, { resource: scheduledEventEntity })
      })

      it('returns a promise that resolves to expected result', async () => {
        const result = await client.get(uuid)
        const locationEntity = scheduledEventEntity.location as InviteeSpecifiedLocationEntity

        expect(result.location).toEqual<InviteeSpecifiedLocation>({
          type: LocationType.InviteeSpecified,
          location: locationEntity.location
        })
      })
    })

    describe('when the location is microsoft teams conference', () => {
      const scheduledEventEntity = ScheduledEventFactory.createEntity(LocationType.MicrosoftTeamsConference)

      beforeAll(() => {
        nock('https://api.calendly.com', {
          reqheaders: {
            authorization: `${token.tokenType} ${token.accessToken}`
          }
        }).get(`/scheduled_events/${uuid}`)
        .reply(200, { resource: scheduledEventEntity })
      })

      it('returns a promise that resolves to expected result', async () => {
        const result = await client.get(uuid)
        const locationEntity = scheduledEventEntity.location as MicrosoftTeamsConferenceEntity

        expect(result.location).toEqual<MicrosoftTeamsConference>({
          type: LocationType.MicrosoftTeamsConference,
          status: locationEntity.status as ConferenceStatus,
          joinUrl: locationEntity.join_url,
          data: locationEntity.data
        })
      })
    })

    describe('when the location is outbound call', () => {
      const scheduledEventEntity = ScheduledEventFactory.createEntity(LocationType.OutboundCall)

      beforeAll(() => {
        nock('https://api.calendly.com', {
          reqheaders: {
            authorization: `${token.tokenType} ${token.accessToken}`
          }
        }).get(`/scheduled_events/${uuid}`)
        .reply(200, { resource: scheduledEventEntity })
      })

      it('returns a promise that resolves to expected result', async () => {
        const result = await client.get(uuid)
        const locationEntity = scheduledEventEntity.location as OutboundCallEntity

        expect(result.location).toEqual<OutboundCall>({
          type: LocationType.OutboundCall,
          location: locationEntity.location
        })
      })
    })

    describe('when the location is zoom conference', () => {
      const scheduledEventEntity = ScheduledEventFactory.createEntity(LocationType.ZoomConference)

      beforeAll(() => {
        nock('https://api.calendly.com', {
          reqheaders: {
            authorization: `${token.tokenType} ${token.accessToken}`
          }
        }).get(`/scheduled_events/${uuid}`)
        .reply(200, { resource: scheduledEventEntity })
      })

      it('returns a promise that resolves to expected result', async () => {
        const result = await client.get(uuid)
        const locationEntity = scheduledEventEntity.location as ZoomConferenceEntity

        expect(result.location).toEqual<ZoomConference>({
          type: LocationType.ZoomConference,
          status: locationEntity.status as ConferenceStatus,
          joinUrl: locationEntity.join_url,
          data: {
            id: locationEntity.data.id,
            settings: {
              globalDialInNumbers: [
                {
                  number: locationEntity.data.settings.global_dial_in_numbers[0].number,
                  country: locationEntity.data.settings.global_dial_in_numbers[0].country,
                  type: locationEntity.data.settings.global_dial_in_numbers[0].type,
                  city: locationEntity.data.settings.global_dial_in_numbers[0].city,
                  countryName: locationEntity.data.settings.global_dial_in_numbers[0].country_name
                },
                {
                  number: locationEntity.data.settings.global_dial_in_numbers[1].number,
                  country: locationEntity.data.settings.global_dial_in_numbers[1].country,
                  type: locationEntity.data.settings.global_dial_in_numbers[1].type,
                  city: locationEntity.data.settings.global_dial_in_numbers[1].city,
                  countryName: locationEntity.data.settings.global_dial_in_numbers[1].country_name
                },
                {
                  number: locationEntity.data.settings.global_dial_in_numbers[2].number,
                  country: locationEntity.data.settings.global_dial_in_numbers[2].country,
                  type: locationEntity.data.settings.global_dial_in_numbers[2].type,
                  city: locationEntity.data.settings.global_dial_in_numbers[2].city,
                  countryName: locationEntity.data.settings.global_dial_in_numbers[2].country_name
                }
              ]
            },
            extra: {
              intlNumbersUrl: locationEntity.data.extra.intl_numbers_url
            },
            password: locationEntity.data.password
          }
        })
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
      nock('https://api.calendly.com', {
        reqheaders: {
          authorization: `${token.tokenType} ${token.accessToken}`
        }
      }).get(`/scheduled_events/${uuid}`).reply(errorStatus, errorDetails)
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
    describe('when organization is provided', () => {
      const organization = faker.internet.url()
      const pagination = {
        count: faker.random.number({ min: 1, max: 100 }),
        next_page: faker.internet.url()
      }
      const eventEntity1 = ScheduledEventFactory.createEntity(LocationType.Custom)
      const eventEntity2 = ScheduledEventFactory.createEntity(LocationType.Custom)
      const eventEntity3 = ScheduledEventFactory.createEntity(LocationType.Custom)

      beforeAll(() => {
        nock('https://api.calendly.com', {
          reqheaders: {
            authorization: `${token.tokenType} ${token.accessToken}`
          }
        }).get('/scheduled_events')
          .query({ organization })
          .reply(200, {
            collection: [
              eventEntity1,
              eventEntity2,
              eventEntity3
            ],
            pagination
          })
      })

      it('returns a promise that resolves to expected result', async () => {
        const result: ScheduledEventList = await client.list({ organization })
        const locationEntity1 = eventEntity1.location as CustomLocationEntity
        const locationEntity2 = eventEntity2.location as CustomLocationEntity
        const locationEntity3 = eventEntity3.location as CustomLocationEntity

        expect(result.pagination).toEqual<Pagination>({
          count: pagination.count,
          nextPage: pagination.next_page
        })

        expect(result.collection).toEqual<ScheduledEvent[]>([
          {
            uri: eventEntity1.uri,
            name: eventEntity1.name,
            status: eventEntity1.status as ScheduledEventStatus,
            startTime: new Date(eventEntity1.start_time),
            endTime: new Date(eventEntity1.end_time),
            eventType: eventEntity1.event_type,
            location: {
              type: LocationType.Custom,
              location: locationEntity1.location
            },
            inviteesCounter: eventEntity1.invitees_counter,
            createdAt: new Date(eventEntity1.created_at),
            updatedAt: new Date(eventEntity1.updated_at),
            eventMemberships: eventEntity1.event_memberships
          },
          {
            uri: eventEntity2.uri,
            name: eventEntity2.name,
            status: eventEntity2.status as ScheduledEventStatus,
            startTime: new Date(eventEntity2.start_time),
            endTime: new Date(eventEntity2.end_time),
            eventType: eventEntity2.event_type,
            location: {
              type: LocationType.Custom,
              location: locationEntity2.location
            },
            inviteesCounter: eventEntity2.invitees_counter,
            createdAt: new Date(eventEntity2.created_at),
            updatedAt: new Date(eventEntity2.updated_at),
            eventMemberships: eventEntity2.event_memberships
          },
          {
            uri: eventEntity3.uri,
            name: eventEntity3.name,
            status: eventEntity3.status as ScheduledEventStatus,
            startTime: new Date(eventEntity3.start_time),
            endTime: new Date(eventEntity3.end_time),
            eventType: eventEntity3.event_type,
            location: {
              type: LocationType.Custom,
              location: locationEntity3.location
            },
            inviteesCounter: eventEntity3.invitees_counter,
            createdAt: new Date(eventEntity3.created_at),
            updatedAt: new Date(eventEntity3.updated_at),
            eventMemberships: eventEntity3.event_memberships
          }
        ])
      })
    })

    describe('when user is provided', () => {
      const user = faker.internet.url()
      const pagination = {
        count: faker.random.number({ min: 1, max: 100 }),
        next_page: faker.internet.url()
      }
      const eventEntity1 = ScheduledEventFactory.createEntity(LocationType.Custom)
      const locationEntity1 = eventEntity1.location as CustomLocationEntity
      const expectedPagination: Pagination = {
        count: pagination.count,
        nextPage: pagination.next_page
      }
      const expectedCollection: ScheduledEvent[] = [
        {
          uri: eventEntity1.uri,
          name: eventEntity1.name,
          status: eventEntity1.status as ScheduledEventStatus,
          startTime: new Date(eventEntity1.start_time),
          endTime: new Date(eventEntity1.end_time),
          eventType: eventEntity1.event_type,
          location: {
            type: LocationType.Custom,
            location: locationEntity1.location
          },
          inviteesCounter: eventEntity1.invitees_counter,
          createdAt: new Date(eventEntity1.created_at),
          updatedAt: new Date(eventEntity1.updated_at),
          eventMemberships: eventEntity1.event_memberships
        }
      ]

      beforeAll(() => {
        nock('https://api.calendly.com', {
          reqheaders: {
            authorization: `${token.tokenType} ${token.accessToken}`
          }
        }).get('/scheduled_events')
          .query({ user })
          .reply(200, {
            collection: [ eventEntity1 ],
            pagination
          })
      })

      it('returns a promise that resolves to expected result', async () => {
        const result: ScheduledEventList = await client.list({ user })

        expect(result.collection).toEqual<ScheduledEvent[]>(expectedCollection)
        expect(result.pagination).toEqual<Pagination>(expectedPagination)
      })

      describe('when count is provided', () => {
        const count = faker.random.number({ min: 1, max: 20 })

        beforeAll(() => {
          nock('https://api.calendly.com', {
            reqheaders: {
              authorization: `${token.tokenType} ${token.accessToken}`
            }
          }).get('/scheduled_events')
            .query({ user, count })
            .reply(200, {
              collection: [ eventEntity1 ],
              pagination
            })
        })

        it('returns a promise that resolves to expected result', async () => {
          const result: ScheduledEventList = await client.list({ user, count })

          expect(result.collection).toEqual<ScheduledEvent[]>(expectedCollection)
          expect(result.pagination).toEqual<Pagination>(expectedPagination)
        })

        describe('when invitee email is provided', () => {
          const inviteeEmail = faker.internet.email()

          beforeAll(() => {
            nock('https://api.calendly.com', {
              reqheaders: {
                authorization: `${token.tokenType} ${token.accessToken}`
              }
            }).get('/scheduled_events')
              .query({ user, count, invitee_email: inviteeEmail })
              .reply(200, {
                collection: [ eventEntity1 ],
                pagination
              })
          })

          it('returns a promise that resolves to expected result', async () => {
            const result: ScheduledEventList = await client.list({ user, count, inviteeEmail })

            expect(result.collection).toEqual<ScheduledEvent[]>(expectedCollection)
            expect(result.pagination).toEqual<Pagination>(expectedPagination)
          })

          describe('when max start time is provided', () => {
            const maxStartTime = faker.date.recent(100)

            beforeAll(() => {
              nock('https://api.calendly.com', {
                reqheaders: {
                  authorization: `${token.tokenType} ${token.accessToken}`
                }
              }).get('/scheduled_events')
                .query({ user, count, invitee_email: inviteeEmail, max_start_time: maxStartTime.toJSON() })
                .reply(200, {
                  collection: [ eventEntity1 ],
                  pagination
                })
            })

            it('returns a promise that resolves to expected result', async () => {
              const result: ScheduledEventList = await client.list({ user, count, inviteeEmail, maxStartTime })

              expect(result.collection).toEqual<ScheduledEvent[]>(expectedCollection)
              expect(result.pagination).toEqual<Pagination>(expectedPagination)
            })

            describe('when min start time is provided', () => {
              const minStartTime = faker.date.recent(100)

              beforeAll(() => {
                nock('https://api.calendly.com', {
                  reqheaders: {
                    authorization: `${token.tokenType} ${token.accessToken}`
                  }
                }).get('/scheduled_events')
                  .query({
                    user,
                    count,
                    invitee_email: inviteeEmail,
                    max_start_time: maxStartTime.toJSON(),
                    min_start_time: minStartTime.toJSON()
                  })
                  .reply(200, {
                    collection: [ eventEntity1 ],
                    pagination
                  })
              })
      
              it('returns a promise that resolves to expected result', async () => {
                const result: ScheduledEventList = await client.list({
                  user,
                  count,
                  inviteeEmail,
                  maxStartTime,
                  minStartTime
                })
  
                expect(result.collection).toEqual<ScheduledEvent[]>(expectedCollection)
                expect(result.pagination).toEqual<Pagination>(expectedPagination)
              })

              describe('when page token is provided', () => {
                const pageToken = faker.random.uuid()
        
                beforeAll(() => {
                  nock('https://api.calendly.com', {
                    reqheaders: {
                      authorization: `${token.tokenType} ${token.accessToken}`
                    }
                  }).get('/scheduled_events')
                    .query({
                      user,
                      count,
                      invitee_email: inviteeEmail,
                      max_start_time: maxStartTime.toJSON(),
                      min_start_time: minStartTime.toJSON(),
                      page_token: pageToken
                    })
                    .reply(200, {
                      collection: [ eventEntity1 ],
                      pagination
                    })
                })
        
                it('returns a promise that resolves to expected result', async () => {
                  const result: ScheduledEventList = await client.list({
                    user,
                    count,
                    inviteeEmail,
                    maxStartTime,
                    minStartTime,
                    pageToken
                  })
    
                  expect(result.collection).toEqual<ScheduledEvent[]>(expectedCollection)
                  expect(result.pagination).toEqual<Pagination>(expectedPagination)
                })

                describe('when sort is provided', () => {
                  const sort = faker.random
                    .arrayElement(['start_time:asc', 'start_time:desc']) as ScheduledEventSort
          
                  beforeAll(() => {
                    nock('https://api.calendly.com', {
                      reqheaders: {
                        authorization: `${token.tokenType} ${token.accessToken}`
                      }
                    }).get('/scheduled_events')
                      .query({
                        user,
                        count,
                        invitee_email: inviteeEmail,
                        max_start_time: maxStartTime.toJSON(),
                        min_start_time: minStartTime.toJSON(),
                        page_token: pageToken,
                        sort: sort
                      })
                      .reply(200, {
                        collection: [ eventEntity1 ],
                        pagination
                      })
                  })
          
                  it('returns a promise that resolves to expected result', async () => {
                    const result: ScheduledEventList = await client.list({
                      user,
                      count,
                      inviteeEmail,
                      maxStartTime,
                      minStartTime,
                      pageToken,
                      sort
                    })
      
                    expect(result.collection).toEqual<ScheduledEvent[]>(expectedCollection)
                    expect(result.pagination).toEqual<Pagination>(expectedPagination)
                  })

                  describe('when status is provided', () => {
                    const status = faker.random
                      .arrayElement(['active', 'canceled']) as ScheduledEventStatus
            
                    beforeAll(() => {
                      nock('https://api.calendly.com', {
                        reqheaders: {
                          authorization: `${token.tokenType} ${token.accessToken}`
                        }
                      }).get('/scheduled_events')
                        .query({
                          user,
                          count,
                          invitee_email: inviteeEmail,
                          max_start_time: maxStartTime.toJSON(),
                          min_start_time: minStartTime.toJSON(),
                          page_token: pageToken,
                          sort,
                          status
                        })
                        .reply(200, {
                          collection: [ eventEntity1 ],
                          pagination
                        })
                    })
            
                    it('returns a promise that resolves to expected result', async () => {
                      const result: ScheduledEventList = await client.list({
                        user,
                        count,
                        inviteeEmail,
                        maxStartTime,
                        minStartTime,
                        pageToken,
                        sort,
                        status
                      })
        
                      expect(result.collection).toEqual<ScheduledEvent[]>(expectedCollection)
                      expect(result.pagination).toEqual<Pagination>(expectedPagination)
                    })
                  })
                })
              })
            })
          })
        })
      })
    })
  })

  describe('when response status is not okay', () => {
    const organization = faker.internet.url()
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
      nock('https://api.calendly.com', {
        reqheaders: {
          authorization: `${token.tokenType} ${token.accessToken}`
        }
      })
      .get('/scheduled_events')
      .query({ organization })
      .reply(errorStatus, errorDetails)
    })

    it('returns a promise that rejects', async () => {
      let result: CalendlyError

      try {
        await client.list({ organization })
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