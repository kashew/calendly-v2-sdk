import { OrganizationMembership, OrganizationRole, Token } from 'src/types'
import { OrganizationMembershipFactory, TokenFactory } from '../factories'
import CalendlyError from 'src/errors/calendlyError'
import { OrganizationMembershipsClient } from 'src'
import faker from 'faker'
import nock from 'nock'

const token: Token = TokenFactory.create()
const client = new OrganizationMembershipsClient(token)

describe('.get', () => {
  const uuid = faker.random.alphaNumeric(16)
  
  describe('when response status is ok', () => {
    const orgMemberEntity = OrganizationMembershipFactory.createEntity()

    beforeAll(() => {
      nock('https://api.calendly.com', {
        reqheaders: {
          authorization: `${token.tokenType} ${token.accessToken}`
        }
      }).get(`/organization_memberships/${uuid}`).reply(200, {
        resource: orgMemberEntity
      })
    })

    it('returns a promise that resolves', async () => {
      const result = client.get(uuid)

      await expect(result).resolves.toEqual<OrganizationMembership>({
        uri: orgMemberEntity.uri,
        role: orgMemberEntity.role as OrganizationRole,
        user: {
          avatarUrl: orgMemberEntity.user.avatar_url,
          createdAt: orgMemberEntity.user.created_at,
          email: orgMemberEntity.user.email,
          name: orgMemberEntity.user.name,
          schedulingUrl: orgMemberEntity.user.scheduling_url,
          slug: orgMemberEntity.user.slug,
          timezone: orgMemberEntity.user.timezone,
          updatedAt: orgMemberEntity.user.updated_at,
          uri: orgMemberEntity.user.uri
        },
        organization: orgMemberEntity.organization,
        updatedAt: new Date(orgMemberEntity.updated_at),
        createdAt: new Date(orgMemberEntity.created_at)
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
      }).get(`/organization_memberships/${uuid}`).reply(errorStatus, errorDetails)
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