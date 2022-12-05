import { EventType, EventTypeList, EventTypeSort, EventTypeType, Kind, Pagination, PoolingType, ProfileType, Token } from '@/types'
import { EventTypeFactory, TokenFactory } from '../factories'
import CalendlyError from '@/errors/calendlyError'
import EventTypesClient from '@/clients/eventTypesClient'
import faker from 'faker'
import nock from 'nock'

const token: Token = TokenFactory.create()

const client = new EventTypesClient(token)

it('creates new calendly client', () => {
  expect(client).toBeInstanceOf(EventTypesClient)
})

describe('.get', () => {
  describe('when response status is ok', () => {
    const uuid = faker.random.alphaNumeric(8)
    const eventTypeEntity = EventTypeFactory.createEntity()

    beforeAll(() => {
      nock('https://api.calendly.com', {
        reqheaders: {
          authorization: `${token.tokenType} ${token.accessToken}`
        }
      }).get(`/event_types/${uuid}`)
      .reply(200, { resource: eventTypeEntity })
    })

    it('returns a promise that resolves', async () => {
      const result = client.get(uuid)

      await expect(result).resolves.toEqual<EventType>({
        uri: eventTypeEntity.uri,
        name: eventTypeEntity.name,
        active: eventTypeEntity.active,
        slug: eventTypeEntity.slug,
        schedulingUrl: eventTypeEntity.scheduling_url,
        duration: eventTypeEntity.duration,
        kind: eventTypeEntity.kind as Kind,
        poolingType: eventTypeEntity.pooling_type as PoolingType,
        type: eventTypeEntity.type as EventTypeType,
        color: eventTypeEntity.color,
        createdAt: new Date(eventTypeEntity.created_at),
        updatedAt: new Date(eventTypeEntity.updated_at),
        internalNote: eventTypeEntity.internal_note,
        descriptionPlain: eventTypeEntity.description_plain,
        descriptionHtml: eventTypeEntity.description_html,
        profile: {
          type: eventTypeEntity.profile.type as ProfileType,
          name: eventTypeEntity.profile.name,
          owner: eventTypeEntity.profile.owner
        },
        secret: eventTypeEntity.secret,
        customQuestions: []
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
      }).get(`/event_types/${uuid}`).reply(errorStatus, errorDetails)
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
    const user = faker.internet.url()

    const pagination = {
      count: faker.random.number({ min: 1, max: 100 }),
      next_page: faker.internet.url()
    }
    const eventTypeEntity1 = EventTypeFactory.createEntity()
    const eventTypeEntity2 = EventTypeFactory.createEntity()
    const eventTypeEntity3 = EventTypeFactory.createEntity()

    const nockScope = nock('https://api.calendly.com', {
      reqheaders: {
        authorization: `${token.tokenType} ${token.accessToken}`
      }
    }).get('/event_types')
      .query({ user })
      .reply(200, {
        collection: [
          eventTypeEntity1,
          eventTypeEntity2,
          eventTypeEntity3
        ],
        pagination
      })

    it('returns a promise that resolves', async () => {
      const result: EventTypeList = await client.list({ user })

      expect(result.pagination).toEqual<Pagination>({
        count: pagination.count,
        nextPage: pagination.next_page
      })

      expect(result.collection).toEqual<EventType[]>([
        {
          uri: eventTypeEntity1.uri,
          name: eventTypeEntity1.name,
          active: eventTypeEntity1.active,
          slug: eventTypeEntity1.slug,
          schedulingUrl: eventTypeEntity1.scheduling_url,
          duration: eventTypeEntity1.duration,
          kind: eventTypeEntity1.kind as Kind,
          poolingType: eventTypeEntity1.pooling_type as PoolingType,
          type: eventTypeEntity1.type as EventTypeType,
          color: eventTypeEntity1.color,
          createdAt: new Date(eventTypeEntity1.created_at),
          updatedAt: new Date(eventTypeEntity1.updated_at),
          internalNote: eventTypeEntity1.internal_note,
          descriptionPlain: eventTypeEntity1.description_plain,
          descriptionHtml: eventTypeEntity1.description_html,
          profile: {
            type: eventTypeEntity1.profile.type as ProfileType,
            name: eventTypeEntity1.profile.name,
            owner: eventTypeEntity1.profile.owner
          },
          secret: eventTypeEntity1.secret,
          customQuestions: []
        },
        {
          uri: eventTypeEntity2.uri,
          name: eventTypeEntity2.name,
          active: eventTypeEntity2.active,
          slug: eventTypeEntity2.slug,
          schedulingUrl: eventTypeEntity2.scheduling_url,
          duration: eventTypeEntity2.duration,
          kind: eventTypeEntity2.kind as Kind,
          poolingType: eventTypeEntity2.pooling_type as PoolingType,
          type: eventTypeEntity2.type as EventTypeType,
          color: eventTypeEntity2.color,
          createdAt: new Date(eventTypeEntity2.created_at),
          updatedAt: new Date(eventTypeEntity2.updated_at),
          internalNote: eventTypeEntity2.internal_note,
          descriptionPlain: eventTypeEntity2.description_plain,
          descriptionHtml: eventTypeEntity2.description_html,
          profile: {
            type: eventTypeEntity2.profile.type as ProfileType,
            name: eventTypeEntity2.profile.name,
            owner: eventTypeEntity2.profile.owner
          },
          secret: eventTypeEntity2.secret,
          customQuestions: []
        },
        {
          uri: eventTypeEntity3.uri,
          name: eventTypeEntity3.name,
          active: eventTypeEntity3.active,
          slug: eventTypeEntity3.slug,
          schedulingUrl: eventTypeEntity3.scheduling_url,
          duration: eventTypeEntity3.duration,
          kind: eventTypeEntity3.kind as Kind,
          poolingType: eventTypeEntity3.pooling_type as PoolingType,
          type: eventTypeEntity3.type as EventTypeType,
          color: eventTypeEntity3.color,
          createdAt: new Date(eventTypeEntity3.created_at),
          updatedAt: new Date(eventTypeEntity3.updated_at),
          internalNote: eventTypeEntity3.internal_note,
          descriptionPlain: eventTypeEntity3.description_plain,
          descriptionHtml: eventTypeEntity3.description_html,
          profile: {
            type: eventTypeEntity3.profile.type as ProfileType,
            name: eventTypeEntity3.profile.name,
            owner: eventTypeEntity3.profile.owner
          },
          secret: eventTypeEntity3.secret,
          customQuestions: []
        }
      ])
    })

    describe('when count is provided', () => {
      const count = faker.random.number({ min: 1, max: 20 })

      beforeAll(() => {
        nockScope.get('/event_types')
          .query({ user, count })
          .reply(200, {
            collection: [ eventTypeEntity1 ],
            pagination
          })
      })

      it('returns a promise that resolves', async () => {
        const result: EventTypeList = await client.list({ user, count })

        expect(result.pagination).toEqual<Pagination>({
          count: pagination.count,
          nextPage: pagination.next_page
        })

        expect(result.collection).toEqual<EventType[]>([
          {
            uri: eventTypeEntity1.uri,
            name: eventTypeEntity1.name,
            active: eventTypeEntity1.active,
            slug: eventTypeEntity1.slug,
            schedulingUrl: eventTypeEntity1.scheduling_url,
            duration: eventTypeEntity1.duration,
            kind: eventTypeEntity1.kind as Kind,
            poolingType: eventTypeEntity1.pooling_type as PoolingType,
            type: eventTypeEntity1.type as EventTypeType,
            color: eventTypeEntity1.color,
            createdAt: new Date(eventTypeEntity1.created_at),
            updatedAt: new Date(eventTypeEntity1.updated_at),
            internalNote: eventTypeEntity1.internal_note,
            descriptionPlain: eventTypeEntity1.description_plain,
            descriptionHtml: eventTypeEntity1.description_html,
            profile: {
              type: eventTypeEntity1.profile.type as ProfileType,
              name: eventTypeEntity1.profile.name,
              owner: eventTypeEntity1.profile.owner
            },
            secret: eventTypeEntity1.secret,
            customQuestions: []
          }
        ])
      })

      describe('when page token is provided', () => {
        const pageToken = faker.random.uuid()

        beforeAll(() => {
          nockScope.get('/event_types')
            .query({ user, count, page_token: pageToken })
            .reply(200, {
              collection: [ eventTypeEntity1 ],
              pagination
            })
        })

        it('returns a promise that resolves', async () => {
          const result: EventTypeList = await client.list({ user, count, pageToken })

          expect(result.pagination).toEqual<Pagination>({
            count: pagination.count,
            nextPage: pagination.next_page
          })

          expect(result.collection).toEqual<EventType[]>([
            {
              uri: eventTypeEntity1.uri,
              name: eventTypeEntity1.name,
              active: eventTypeEntity1.active,
              slug: eventTypeEntity1.slug,
              schedulingUrl: eventTypeEntity1.scheduling_url,
              duration: eventTypeEntity1.duration,
              kind: eventTypeEntity1.kind as Kind,
              poolingType: eventTypeEntity1.pooling_type as PoolingType,
              type: eventTypeEntity1.type as EventTypeType,
              color: eventTypeEntity1.color,
              createdAt: new Date(eventTypeEntity1.created_at),
              updatedAt: new Date(eventTypeEntity1.updated_at),
              internalNote: eventTypeEntity1.internal_note,
              descriptionPlain: eventTypeEntity1.description_plain,
              descriptionHtml: eventTypeEntity1.description_html,
              profile: {
                type: eventTypeEntity1.profile.type as ProfileType,
                name: eventTypeEntity1.profile.name,
                owner: eventTypeEntity1.profile.owner
              },
              secret: eventTypeEntity1.secret,
              customQuestions: []
            }
          ])
        })

        describe('when sort is provided', () => {
          const sort = faker.random.arrayElement(['name:asc', 'name:desc']) as EventTypeSort

          beforeAll(() => {
            nockScope.get('/event_types')
              .query({ user, count, page_token: pageToken, sort })
              .reply(200, {
                collection: [ eventTypeEntity1 ],
                pagination
              })
          })

          it('returns a promise that resolves', async () => {
            const result: EventTypeList = await client.list({ user, count, pageToken, sort })

            expect(result.pagination).toEqual<Pagination>({
              count: pagination.count,
              nextPage: pagination.next_page
            })

            expect(result.collection).toEqual<EventType[]>([
              {
                uri: eventTypeEntity1.uri,
                name: eventTypeEntity1.name,
                active: eventTypeEntity1.active,
                slug: eventTypeEntity1.slug,
                schedulingUrl: eventTypeEntity1.scheduling_url,
                duration: eventTypeEntity1.duration,
                kind: eventTypeEntity1.kind as Kind,
                poolingType: eventTypeEntity1.pooling_type as PoolingType,
                type: eventTypeEntity1.type as EventTypeType,
                color: eventTypeEntity1.color,
                createdAt: new Date(eventTypeEntity1.created_at),
                updatedAt: new Date(eventTypeEntity1.updated_at),
                internalNote: eventTypeEntity1.internal_note,
                descriptionPlain: eventTypeEntity1.description_plain,
                descriptionHtml: eventTypeEntity1.description_html,
                profile: {
                  type: eventTypeEntity1.profile.type as ProfileType,
                  name: eventTypeEntity1.profile.name,
                  owner: eventTypeEntity1.profile.owner
                },
                secret: eventTypeEntity1.secret,
                customQuestions: []
              }
            ])
          })
        })
      })
    })
  })

  describe('when response status is not okay', () => {
    const user = faker.internet.url()
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
      .get('/event_types')
      .query({ user })
      .reply(errorStatus, errorDetails)
    })

    it('returns a promise that rejects', async () => {
      let result: CalendlyError

      try {
        await client.list({ user })
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