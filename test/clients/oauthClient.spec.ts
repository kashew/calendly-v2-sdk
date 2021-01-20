import { GrantType, IntrospectResponse, Token } from '@/types'
import OAuthClient from '@/clients/oauthClient'
import OAuthError from '@/errors/oauthError'
import faker from 'faker'
import nock from 'nock'

const clientId = faker.random.uuid()
const clientSecret = faker.random.uuid()
const redirectUri = faker.internet.url()
const tokenType = 'Bearer'
const scope = 'default'

const client = new OAuthClient(clientId, clientSecret)
const nockScope = nock('https://auth.calendly.com')

it('creates new oauth client', () => {
  expect(client).toBeInstanceOf(OAuthClient)
})

describe('when only a client id is provided', () => {
  const client2 = new OAuthClient(clientId)

  it('creates new oauth client', () => {
    expect(client2).toBeInstanceOf(OAuthClient)
  })
})

describe('.token', () => {
  describe('when grant type is authorization code', () => {
    const accessToken = faker.random.uuid()
    const refreshToken = faker.lorem.word()
    const createdAt = faker.random.number({ min: 1000000000, max: 9000000000 })
    const expiresIn = faker.random.number({ min: 1, max: 7200 })
    const owner = faker.internet.url()
    const organization = faker.internet.url()

    describe('when response status is ok', () => {
      const code = faker.random.uuid()

      beforeAll(() => {
        nockScope.post('/oauth/token', {
          client_id: clientId,
          client_secret: clientSecret,
          code,
          grant_type: GrantType.AuthorizationCode,
          redirect_uri: redirectUri
        })
        .reply(200, {
          access_token: accessToken,
          created_at: createdAt,
          expires_in: expiresIn,
          refresh_token: refreshToken,
          scope,
          token_type: tokenType,
          organization,
          owner,
        })
      })

      it('returns promise that resolves', async () => {
        const result = client.token({
          code,
          grantType: GrantType.AuthorizationCode,
          redirectUri
        })

        await expect(result).resolves.toEqual<Token>({
          accessToken,
          createdAt: new Date(createdAt * 1000),
          expiresIn,
          organization,
          owner,
          refreshToken,
          scope,
          tokenType
        })
      })
    })

    describe('when response status is unauthorized', () => {
      const code = faker.random.uuid()
      const errorDetails = {
        error: 'invalid_client',
        error_description: 'Client authentication failed due to unknown client, no client authentication included, or unsupported authentication method.'
      }

      beforeAll(() => {
        nockScope.post('/oauth/token', {
          client_id: clientId,
          client_secret: clientSecret,
          code,
          grant_type: GrantType.AuthorizationCode,
          redirect_uri: redirectUri
        })
        .reply(401, errorDetails)
      })

      it('returns promise that rejects', async () => {
        let result: OAuthError

        try {
          await client.token({
            code,
            grantType: GrantType.AuthorizationCode,
            redirectUri
          })
        } catch (e) {
          result = e as OAuthError
        }

        expect(result.message).toEqual('Request failed with status code 401')
        expect(result.status).toEqual(401)
        expect(result.details).toEqual(errorDetails)
      })
    })
  })

  describe('when grant type is refresh token', () => {
    const accessToken = faker.random.uuid()
    const refreshToken = faker.lorem.word()
    const createdAt = faker.random.number({ min: 1000000000, max: 9000000000 })
    const expiresIn = faker.random.number({ min: 1, max: 7200 })
    const owner = faker.internet.url()
    const organization = faker.internet.url()

    beforeAll(() => {
      nockScope.post('/oauth/token', {
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: GrantType.RefreshToken,
        refresh_token: refreshToken
      })
      .reply(200, {
        access_token: accessToken,
        created_at: createdAt,
        expires_in: expiresIn,
        refresh_token: refreshToken,
        scope,
        token_type: tokenType,
        organization,
        owner,
      })
    })

    it('returns promise that resolves', async () => {
      const result = client.token({
        grantType: GrantType.RefreshToken,
        refreshToken
      })

      await expect(result).resolves.toEqual<Token>({
        accessToken,
        createdAt: new Date(createdAt * 1000),
        expiresIn,
        organization,
        owner,
        refreshToken,
        scope,
        tokenType
      })
    })
  })
})

describe('.introspect', () => {
  const active = faker.random.boolean()
  const exp = faker.random.number({ min: 1, max: 7200 })
  const iat = faker.random.number({ min: 1000000000, max: 9000000000 })
  const owner = faker.internet.url()
  const organization = faker.internet.url()

  describe('when response status is ok', () => {
    const token = faker.random.uuid()

    beforeAll(() => {
      nockScope.post('/oauth/introspect', {
        client_id: clientId,
        client_secret: clientSecret,
        token
      })
      .reply(200, {
        active,
        client_id: clientId,
        exp,
        iat,
        organization,
        owner,
        scope,
        token_type: tokenType
      })
    })

    it('returns promise that resolves', async () => {
      const result = await client.introspect(token)

      expect(result).toEqual<IntrospectResponse>({
        active,
        clientId,
        expiresAt: new Date(exp * 1000),
        issuedAt: new Date(iat * 1000),
        organization,
        owner,
        scope,
        tokenType
      })
    })
  })

  describe('when response status is unauthorized', () => {
    const token = faker.random.uuid()
    const errorDetails = {
      error: 'invalid_client',
      error_description: 'Client authentication failed due to unknown client, no client authentication included, or unsupported authentication method.'
    }

    beforeAll(() => {
      nockScope.post('/oauth/introspect', {
        client_id: clientId,
        client_secret: clientSecret,
        token
      })
      .reply(401, errorDetails)
    })

    it('returns promise that rejects', async () => {
      let result: OAuthError

      try {
        await client.introspect(token)
      } catch (e) {
        result = e as OAuthError
      }

      expect(result).toBeInstanceOf(OAuthError)
      expect(result.message).toEqual('Request failed with status code 401')
      expect(result.status).toEqual(401)
      expect(result.details).toEqual(errorDetails)
    })
  })
})

describe('.revoke', () => {
  describe('when response status is ok', () => {
    const token = faker.random.uuid()

    beforeAll(() => {
      nockScope.post('/oauth/revoke', {
        client_id: clientId,
        client_secret: clientSecret,
        token
      })
      .reply(200)
    })

    it('returns promise that resolves', async () => {
      const result = client.revoke(token)

      await expect(result).resolves.toBeUndefined()
    })
  })

  describe('when response status is forbidden', () => {
    const token = faker.random.uuid()
    const errorDetails = {
      error: 'unauthorized_client',
      error_description: 'You are not authorized to revoke this token'
    }

    beforeAll(() => {
      nockScope.post('/oauth/revoke', {
        client_id: clientId,
        client_secret: clientSecret,
        token
      })
      .reply(403, errorDetails)
    })

    it('returns promise that rejects', async () => {
      let result: OAuthError

      try {
        await client.revoke(token)
      } catch (e) {
        result = e as OAuthError
      }

      expect(result).toBeInstanceOf(OAuthError)
      expect(result.message).toEqual('Request failed with status code 403')
      expect(result.status).toEqual(403)
      expect(result.details).toEqual(errorDetails)
    })
  })
})