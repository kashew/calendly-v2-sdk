import { Pagination, Token, WebhookSubscription, WebhookSubscriptionEvent, WebhookSubscriptionList, WebhookSubscriptionScope, WebhookSubscriptionState } from '@/types'
import { TokenFactory, WebhookSubscriptionFactory } from '../factories'
import CalendlyError from '@/errors/calendlyError'
import { WebhookSubscriptionSort } from '@/types/webhookSubscriptions'
import { WebhookSubscriptionsClient } from '@'
import faker from 'faker'
import nock from 'nock'

const token: Token = TokenFactory.create()
const client = new WebhookSubscriptionsClient(token)

describe('.get', () => {
  const uuid = faker.random.alphaNumeric(16)
  
  describe('when response status is ok', () => {
    const webhookEntity = WebhookSubscriptionFactory.createEntity()

    beforeAll(() => {
      nock('https://api.calendly.com', {
        reqheaders: {
          authorization: `${token.tokenType} ${token.accessToken}`
        }
      }).get(`/webhook_subscriptions/${uuid}`).reply(200, {
        resource: webhookEntity
      })
    })

    it('returns a promise that resolves', async () => {
      const result = client.get(uuid)

      await expect(result).resolves.toEqual<WebhookSubscription>({
        uri: webhookEntity.uri,
        callbackUrl: webhookEntity.callback_url,
        createdAt: new Date(webhookEntity.created_at),
        updatedAt: new Date(webhookEntity.updated_at),
        retryStartedAt: new Date(webhookEntity.retry_started_at),
        state: webhookEntity.state as WebhookSubscriptionState,
        events: webhookEntity.events.map(e => e as WebhookSubscriptionEvent),
        scope: webhookEntity.scope as WebhookSubscriptionScope,
        organization: webhookEntity.organization,
        user: webhookEntity.user,
        creator: webhookEntity.creator
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
      }).get(`/webhook_subscriptions/${uuid}`).reply(errorStatus, errorDetails)
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
    describe('when scope is set to organization', () => {
      const organization = faker.internet.url()
      const scope = WebhookSubscriptionScope.Organization
      const pagination = {
        count: faker.random.number({ min: 1, max: 100 }),
        next_page: faker.internet.url()
      }
      const webhookEntity1 = WebhookSubscriptionFactory.createEntity()
      const webhookEntity2 = WebhookSubscriptionFactory.createEntity()
      const webhookEntity3 = WebhookSubscriptionFactory.createEntity()

      beforeAll(() => {
        nock('https://api.calendly.com', {
          reqheaders: {
            authorization: `${token.tokenType} ${token.accessToken}`
          }
        }).get('/webhook_subscriptions')
          .query({ organization, scope })
          .reply(200, {
            collection: [
              webhookEntity1,
              webhookEntity2,
              webhookEntity3
            ],
            pagination
          })
      })

      it('returns a promise that resolves to expected result', async () => {
        const result: WebhookSubscriptionList = await client.list({ organization, scope })

        expect(result.pagination).toEqual<Pagination>({
          count: pagination.count,
          nextPage: pagination.next_page
        })

        expect(result.collection).toEqual<WebhookSubscription[]>([
          {
            uri: webhookEntity1.uri,
            callbackUrl: webhookEntity1.callback_url,
            createdAt: new Date(webhookEntity1.created_at),
            updatedAt: new Date(webhookEntity1.updated_at),
            retryStartedAt: new Date(webhookEntity1.retry_started_at),
            state: webhookEntity1.state as WebhookSubscriptionState,
            events: webhookEntity1.events.map(e => e as WebhookSubscriptionEvent),
            scope: webhookEntity1.scope as WebhookSubscriptionScope,
            organization: webhookEntity1.organization,
            user: webhookEntity1.user,
            creator: webhookEntity1.creator
          },
          {
            uri: webhookEntity2.uri,
            callbackUrl: webhookEntity2.callback_url,
            createdAt: new Date(webhookEntity2.created_at),
            updatedAt: new Date(webhookEntity2.updated_at),
            retryStartedAt: new Date(webhookEntity2.retry_started_at),
            state: webhookEntity2.state as WebhookSubscriptionState,
            events: webhookEntity2.events.map(e => e as WebhookSubscriptionEvent),
            scope: webhookEntity2.scope as WebhookSubscriptionScope,
            organization: webhookEntity2.organization,
            user: webhookEntity2.user,
            creator: webhookEntity2.creator
          },
          {
            uri: webhookEntity3.uri,
            callbackUrl: webhookEntity3.callback_url,
            createdAt: new Date(webhookEntity3.created_at),
            updatedAt: new Date(webhookEntity3.updated_at),
            retryStartedAt: new Date(webhookEntity3.retry_started_at),
            state: webhookEntity3.state as WebhookSubscriptionState,
            events: webhookEntity3.events.map(e => e as WebhookSubscriptionEvent),
            scope: webhookEntity3.scope as WebhookSubscriptionScope,
            organization: webhookEntity3.organization,
            user: webhookEntity3.user,
            creator: webhookEntity3.creator
          }
        ])
      })

      describe('when count is provided', () => {
        const count = faker.random.number({ min: 1, max: 20 })
        const pagination = {
          count: faker.random.number({ min: 1, max: 100 }),
          next_page: faker.internet.url()
        }
        const webhookEntity1 = WebhookSubscriptionFactory.createEntity()
        const expectedPagination: Pagination = {
          count: pagination.count,
          nextPage: pagination.next_page
        }
        const expectedCollection: WebhookSubscription[] = [
          {
            uri: webhookEntity1.uri,
            callbackUrl: webhookEntity1.callback_url,
            createdAt: new Date(webhookEntity1.created_at),
            updatedAt: new Date(webhookEntity1.updated_at),
            retryStartedAt: new Date(webhookEntity1.retry_started_at),
            state: webhookEntity1.state as WebhookSubscriptionState,
            events: webhookEntity1.events.map(e => e as WebhookSubscriptionEvent),
            scope: webhookEntity1.scope as WebhookSubscriptionScope,
            organization: webhookEntity1.organization,
            user: webhookEntity1.user,
            creator: webhookEntity1.creator
          }
        ]
  
        beforeAll(() => {
          nock('https://api.calendly.com', {
            reqheaders: {
              authorization: `${token.tokenType} ${token.accessToken}`
            }
          }).get('/webhook_subscriptions')
            .query({ organization, scope, count })
            .reply(200, {
              collection: [ webhookEntity1 ],
              pagination
            })
        })
  
        it('returns a promise that resolves to expected result', async () => {
          const result: WebhookSubscriptionList = await client.list({ organization, scope, count })
  
          expect(result.collection).toEqual<WebhookSubscription[]>(expectedCollection)
          expect(result.pagination).toEqual<Pagination>(expectedPagination)
        })

        describe('when page token is provided', () => {
          const pageToken = faker.random.uuid()
          const pagination = {
            count: faker.random.number({ min: 1, max: 100 }),
            next_page: faker.internet.url()
          }
          const webhookEntity1 = WebhookSubscriptionFactory.createEntity()
          const expectedPagination: Pagination = {
            count: pagination.count,
            nextPage: pagination.next_page
          }
          const expectedCollection: WebhookSubscription[] = [
            {
              uri: webhookEntity1.uri,
              callbackUrl: webhookEntity1.callback_url,
              createdAt: new Date(webhookEntity1.created_at),
              updatedAt: new Date(webhookEntity1.updated_at),
              retryStartedAt: new Date(webhookEntity1.retry_started_at),
              state: webhookEntity1.state as WebhookSubscriptionState,
              events: webhookEntity1.events.map(e => e as WebhookSubscriptionEvent),
              scope: webhookEntity1.scope as WebhookSubscriptionScope,
              organization: webhookEntity1.organization,
              user: webhookEntity1.user,
              creator: webhookEntity1.creator
            }
          ]
    
          beforeAll(() => {
            nock('https://api.calendly.com', {
              reqheaders: {
                authorization: `${token.tokenType} ${token.accessToken}`
              }
            }).get('/webhook_subscriptions')
              .query({ organization, scope, count, page_token: pageToken })
              .reply(200, {
                collection: [ webhookEntity1 ],
                pagination
              })
          })
    
          it('returns a promise that resolves to expected result', async () => {
            const result: WebhookSubscriptionList = await client.list({ organization, scope, count, pageToken })
    
            expect(result.collection).toEqual<WebhookSubscription[]>(expectedCollection)
            expect(result.pagination).toEqual<Pagination>(expectedPagination)
          })

          describe('when sort is provided', () => {
            const sort = faker.random.arrayElement(['created_at:asc', 'created_at:desc']) as WebhookSubscriptionSort
            const pagination = {
              count: faker.random.number({ min: 1, max: 100 }),
              next_page: faker.internet.url()
            }
            const webhookEntity1 = WebhookSubscriptionFactory.createEntity()
            const expectedPagination: Pagination = {
              count: pagination.count,
              nextPage: pagination.next_page
            }
            const expectedCollection: WebhookSubscription[] = [
              {
                uri: webhookEntity1.uri,
                callbackUrl: webhookEntity1.callback_url,
                createdAt: new Date(webhookEntity1.created_at),
                updatedAt: new Date(webhookEntity1.updated_at),
                retryStartedAt: new Date(webhookEntity1.retry_started_at),
                state: webhookEntity1.state as WebhookSubscriptionState,
                events: webhookEntity1.events.map(e => e as WebhookSubscriptionEvent),
                scope: webhookEntity1.scope as WebhookSubscriptionScope,
                organization: webhookEntity1.organization,
                user: webhookEntity1.user,
                creator: webhookEntity1.creator
              }
            ]
      
            beforeAll(() => {
              nock('https://api.calendly.com', {
                reqheaders: {
                  authorization: `${token.tokenType} ${token.accessToken}`
                }
              }).get('/webhook_subscriptions')
                .query({
                  organization,
                  scope,
                  count,
                  page_token: pageToken,
                  sort
                })
                .reply(200, {
                  collection: [ webhookEntity1 ],
                  pagination
                })
            })
      
            it('returns a promise that resolves to expected result', async () => {
              const result: WebhookSubscriptionList = await client.list({ organization, scope, count, pageToken, sort })
      
              expect(result.collection).toEqual<WebhookSubscription[]>(expectedCollection)
              expect(result.pagination).toEqual<Pagination>(expectedPagination)
            })
          })
        })
      })
    })

    describe('when scope is set to user', () => {
      const organization = faker.internet.url()
      const user = faker.internet.url()
      const scope = WebhookSubscriptionScope.User
      const pagination = {
        count: faker.random.number({ min: 1, max: 100 }),
        next_page: faker.internet.url()
      }
      const webhookEntity1 = WebhookSubscriptionFactory.createEntity()
      const webhookEntity2 = WebhookSubscriptionFactory.createEntity()
      const webhookEntity3 = WebhookSubscriptionFactory.createEntity()

      beforeAll(() => {
        nock('https://api.calendly.com', {
          reqheaders: {
            authorization: `${token.tokenType} ${token.accessToken}`
          }
        }).get('/webhook_subscriptions')
          .query({ organization, user, scope })
          .reply(200, {
            collection: [
              webhookEntity1,
              webhookEntity2,
              webhookEntity3
            ],
            pagination
          })
      })

      it('returns a promise that resolves to expected result', async () => {
        const result: WebhookSubscriptionList = await client.list({ organization, user, scope })

        expect(result.pagination).toEqual<Pagination>({
          count: pagination.count,
          nextPage: pagination.next_page
        })

        expect(result.collection).toEqual<WebhookSubscription[]>([
          {
            uri: webhookEntity1.uri,
            callbackUrl: webhookEntity1.callback_url,
            createdAt: new Date(webhookEntity1.created_at),
            updatedAt: new Date(webhookEntity1.updated_at),
            retryStartedAt: new Date(webhookEntity1.retry_started_at),
            state: webhookEntity1.state as WebhookSubscriptionState,
            events: webhookEntity1.events.map(e => e as WebhookSubscriptionEvent),
            scope: webhookEntity1.scope as WebhookSubscriptionScope,
            organization: webhookEntity1.organization,
            user: webhookEntity1.user,
            creator: webhookEntity1.creator
          },
          {
            uri: webhookEntity2.uri,
            callbackUrl: webhookEntity2.callback_url,
            createdAt: new Date(webhookEntity2.created_at),
            updatedAt: new Date(webhookEntity2.updated_at),
            retryStartedAt: new Date(webhookEntity2.retry_started_at),
            state: webhookEntity2.state as WebhookSubscriptionState,
            events: webhookEntity2.events.map(e => e as WebhookSubscriptionEvent),
            scope: webhookEntity2.scope as WebhookSubscriptionScope,
            organization: webhookEntity2.organization,
            user: webhookEntity2.user,
            creator: webhookEntity2.creator
          },
          {
            uri: webhookEntity3.uri,
            callbackUrl: webhookEntity3.callback_url,
            createdAt: new Date(webhookEntity3.created_at),
            updatedAt: new Date(webhookEntity3.updated_at),
            retryStartedAt: new Date(webhookEntity3.retry_started_at),
            state: webhookEntity3.state as WebhookSubscriptionState,
            events: webhookEntity3.events.map(e => e as WebhookSubscriptionEvent),
            scope: webhookEntity3.scope as WebhookSubscriptionScope,
            organization: webhookEntity3.organization,
            user: webhookEntity3.user,
            creator: webhookEntity3.creator
          }
        ])
      })
    })
  })

  describe('when response status is not okay', () => {
    const organization = faker.internet.url()
    const scope = WebhookSubscriptionScope.Organization
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
      .get('/webhook_subscriptions')
      .query({ organization, scope })
      .reply(errorStatus, errorDetails)
    })

    it('returns a promise that rejects', async () => {
      let result: CalendlyError

      try {
        await client.list({ organization, scope })
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

describe('.create', () => {
  const url = faker.internet.url()
  const events = [faker.random.arrayElement(['invitee.created', 'invitee.canceled']) as WebhookSubscriptionEvent]
  const organization = faker.internet.url()
  
  describe('when response status is ok', () => {
    describe('when scope is organization', () => {
      const webhookEntity = WebhookSubscriptionFactory.createEntity()
      const scope = WebhookSubscriptionScope.Organization

      beforeAll(() => {
        nock('https://api.calendly.com', {
          reqheaders: {
            authorization: `${token.tokenType} ${token.accessToken}`
          }
        }).post('/webhook_subscriptions', {
          url,
          events,
          organization,
          scope
        }).reply(201, {
          resource: webhookEntity
        })
      })
      
      it('returns a promise that resolves', async () => {
        const result = client.create({ url, events, organization, scope })

        await expect(result).resolves.toEqual<WebhookSubscription>({
          uri: webhookEntity.uri,
          callbackUrl: webhookEntity.callback_url,
          createdAt: new Date(webhookEntity.created_at),
          updatedAt: new Date(webhookEntity.updated_at),
          retryStartedAt: new Date(webhookEntity.retry_started_at),
          state: webhookEntity.state as WebhookSubscriptionState,
          events: webhookEntity.events.map(e => e as WebhookSubscriptionEvent),
          scope: webhookEntity.scope as WebhookSubscriptionScope,
          organization: webhookEntity.organization,
          user: webhookEntity.user,
          creator: webhookEntity.creator
        })
      })
    })

    describe('when scope is user', () => {
      const webhookEntity = WebhookSubscriptionFactory.createEntity()
      const scope = WebhookSubscriptionScope.User
      const user = faker.internet.url()

      beforeAll(() => {
        nock('https://api.calendly.com', {
          reqheaders: {
            authorization: `${token.tokenType} ${token.accessToken}`
          }
        }).post('/webhook_subscriptions', {
          url,
          events,
          organization,
          user,
          scope
        }).reply(201, {
          resource: webhookEntity
        })
      })

      it('returns a promise that resolves', async () => {
        const result = client.create({ url, events, organization, user, scope })

        await expect(result).resolves.toEqual<WebhookSubscription>({
          uri: webhookEntity.uri,
          callbackUrl: webhookEntity.callback_url,
          createdAt: new Date(webhookEntity.created_at),
          updatedAt: new Date(webhookEntity.updated_at),
          retryStartedAt: new Date(webhookEntity.retry_started_at),
          state: webhookEntity.state as WebhookSubscriptionState,
          events: webhookEntity.events.map(e => e as WebhookSubscriptionEvent),
          scope: webhookEntity.scope as WebhookSubscriptionScope,
          organization: webhookEntity.organization,
          user: webhookEntity.user,
          creator: webhookEntity.creator
        })
      })
    })
  })

  describe('when response status is not ok', () => {
    const scope = WebhookSubscriptionScope.Organization
    const errorStatus = faker.random.arrayElement([400,401,403,404,409])
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
      }).post('/webhook_subscriptions').reply(errorStatus, errorDetails)
    })

    it('returns a promise that rejects', async () => {
      let result: CalendlyError

      try {
        await client.create({ url, events, organization, scope })
      } catch (e) {
        result = e as CalendlyError
      }

      expect(result.title).toEqual(errorDetails.title)
      expect(result.message).toEqual(errorDetails.message)
      expect(result.details).toEqual(errorDetails.details)
      expect(result.status).toEqual(errorStatus)
    })
  })
})

describe('.delete', () => {
  const uuid = faker.random.alphaNumeric(16)

  describe('when response status is no content', () => {
    beforeAll(() => {
      nock('https://api.calendly.com', {
        reqheaders: {
          authorization: `${token.tokenType} ${token.accessToken}`
        }
      }).delete(`/webhook_subscriptions/${uuid}`).reply(204)
    })

    it('returns a promise that resolves', async () => {
      const result = client.delete(uuid)

      await expect(result).resolves.toBeUndefined()
    })
  })

  describe('when response status is not ok', () => {
    const uuid = faker.random.alphaNumeric(8)
    const errorStatus = faker.random.arrayElement([401,403,404,500])
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
      }).delete(`/webhook_subscriptions/${uuid}`).reply(errorStatus, errorDetails)
    })

    it('returns a promise that rejects', async () => {
      let result: CalendlyError

      try {
        await client.delete(uuid)
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