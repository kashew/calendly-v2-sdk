import { SchedulingLink, SchedulingLinkOwnerType, Token } from 'src/types'
import { SchedulingLinkFactory, TokenFactory } from '../factories'
import CalendlyError from 'src/errors/calendlyError'
import SchedulingLinksClient from 'src/clients/schedulingLinksClient'
import faker from 'faker'
import nock from 'nock'

const token: Token = TokenFactory.create()
const client = new SchedulingLinksClient(token)

describe('.create', () => {
  const maxEventCount = 1
  const owner = faker.internet.url()
  const ownerType = SchedulingLinkOwnerType.EventType
  
  describe('when response status is ok', () => {
    const schedulingLinkEntity = SchedulingLinkFactory.createEntity()

    beforeAll(() => {
      nock('https://api.calendly.com', {
        reqheaders: {
          authorization: `${token.tokenType} ${token.accessToken}`
        }
      }).post('/scheduling_links', {
        max_event_count: maxEventCount,
        owner,
        owner_type: ownerType
      }).reply(201, {
        resource: schedulingLinkEntity
      })
    })
    
    it('returns a promise that resolves', async () => {
      const result = client.create({ maxEventCount, owner, ownerType })

      await expect(result).resolves.toEqual<SchedulingLink>({
        bookingUrl: schedulingLinkEntity.booking_url,
        owner: schedulingLinkEntity.owner,
        ownerType: schedulingLinkEntity.owner_type as SchedulingLinkOwnerType
      })
    })
  })

  describe('when response status is not ok', () => {
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
      }).post('/scheduling_links', {
        max_event_count: maxEventCount,
        owner,
        owner_type: ownerType
      }).reply(errorStatus, errorDetails)
    })

    it('returns a promise that rejects', async () => {
      let result: CalendlyError

      try {
        await client.create({ maxEventCount, owner, ownerType })
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