import { Token, User } from 'src/types'
import { TokenFactory, UserFactory } from '../factories'
import CalendlyError from 'src/errors/calendlyError'
import UsersClient from 'src/clients/usersClient'
import faker from 'faker'
import nock from 'nock'

const token: Token = TokenFactory.create()
const client = new UsersClient(token)

it('creates new calendly client', () => {
  expect(client).toBeInstanceOf(UsersClient)
})

describe('.me', () => {
  const userEntity = UserFactory.createEntity()

  describe('when response status is ok', () => {
    beforeAll(() => {
      nock('https://api.calendly.com', {
        reqheaders: {
          authorization: `${token.tokenType} ${token.accessToken}`
        }
      }).get('/users/me').reply(200, {
        resource: userEntity
      })
    })

    it('returns a promise that resolves', async () => {
      const result = client.me()

      await expect(result).resolves.toEqual<User>({
        avatarUrl: userEntity.avatar_url,
        createdAt: new Date(userEntity.created_at),
        email: userEntity.email,
        name: userEntity.name,
        schedulingUrl: userEntity.scheduling_url,
        slug: userEntity.slug,
        timezone: userEntity.timezone,
        updatedAt: new Date(userEntity.updated_at),
        uri: userEntity.uri
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
    const uuid = faker.random.alphaNumeric(16)
    const userEntity = UserFactory.createEntity()

    beforeAll(() => {
      nock('https://api.calendly.com', {
        reqheaders: {
          authorization: `${token.tokenType} ${token.accessToken}`
        }
      }).get(`/users/${uuid}`).reply(200, {
        resource: userEntity
      })
    })

    it('returns a promise that resolves', async () => {
      const result = client.get(uuid)

      await expect(result).resolves.toEqual<User>({
        avatarUrl: userEntity.avatar_url,
        createdAt: new Date(userEntity.created_at),
        email: userEntity.email,
        name: userEntity.name,
        schedulingUrl: userEntity.scheduling_url,
        slug: userEntity.slug,
        timezone: userEntity.timezone,
        updatedAt: new Date(userEntity.updated_at),
        uri: userEntity.uri
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