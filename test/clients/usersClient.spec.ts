import UsersClient from 'src/clients/usersClient'
import faker from 'faker'
import nock from 'nock'
import CalendlyError from 'src/errors/calendlyError'
import { Token, User } from 'src/types'
import { TokenFactory } from '../factories'

const token: Token = TokenFactory.create()
const client = new UsersClient(token)

it('creates new calendly client', () => {
  expect(client).toBeInstanceOf(UsersClient)
})

describe('.me', () => {
  const uri = faker.internet.url()
  const name = faker.name.firstName()
  const slug = faker.lorem.word()
  const email = faker.internet.email()
  const schedulingUrl = faker.internet.url()
  const timezone = faker.lorem.word()
  const avatarUrl = faker.internet.url()
  const createdAt = faker.date.recent(100).toString()
  const updatedAt = faker.date.recent(100).toString()

  describe('when response status is ok', () => {
    beforeAll(() => {
      nock('https://api.calendly.com', {
        reqheaders: {
          authorization: `${token.tokenType} ${token.accessToken}`
        }
      }).get('/users/me').reply(200, {
        resource: {
          uri,
          name,
          slug,
          email,
          scheduling_url: schedulingUrl,
          timezone,
          avatar_url: avatarUrl,
          created_at: createdAt,
          updated_at: updatedAt
        }
      })
    })

    it('returns a promise that resolves', async () => {
      const result = client.me()

      await expect(result).resolves.toEqual<User>({
        avatarUrl,
        createdAt,
        email,
        name,
        schedulingUrl,
        slug,
        timezone,
        updatedAt,
        uri
      })
    })
  })

  describe('when response status is not ok', () => {
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
      }).get('/users/me').reply(errorStatus, errorDetails)
    })

    it('returns a promise that rejects', async () => {
      let result: CalendlyError

      try {
        await client.me()
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

describe('.get', () => {
  describe('when response status is ok', () => {
    const uuid = faker.random.alphaNumeric(8)
    const uri = faker.internet.url()
    const name = faker.name.firstName()
    const slug = faker.lorem.word()
    const email = faker.internet.email()
    const schedulingUrl = faker.internet.url()
    const timezone = faker.lorem.word()
    const avatarUrl = faker.internet.url()
    const createdAt = faker.date.recent(100).toString()
    const updatedAt = faker.date.recent(100).toString()

    beforeAll(() => {
      nock('https://api.calendly.com', {
        reqheaders: {
          authorization: `${token.tokenType} ${token.accessToken}`
        }
      }).get(`/users/${uuid}`).reply(200, {
        resource: {
          uri,
          name,
          slug,
          email,
          scheduling_url: schedulingUrl,
          timezone,
          avatar_url: avatarUrl,
          created_at: createdAt,
          updated_at: updatedAt
        }
      })
    })

    it('returns a promise that resolves', async () => {
      const result = client.get(uuid)

      await expect(result).resolves.toEqual<User>({
        avatarUrl,
        createdAt,
        email,
        name,
        schedulingUrl,
        slug,
        timezone,
        updatedAt,
        uri
      })
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
      }).get(`/users/${uuid}`).reply(errorStatus, errorDetails)
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