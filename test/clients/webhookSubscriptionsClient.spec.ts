import { Token, WebhookSubscription, WebhookSubscriptionEvent, WebhookSubscriptionScope, WebhookSubscriptionState } from 'src/types'
import { TokenFactory, WebhookSubscriptionFactory } from '../factories'
import CalendlyError from 'src/errors/calendlyError'
import { WebhookSubscriptionsClient } from 'src'
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