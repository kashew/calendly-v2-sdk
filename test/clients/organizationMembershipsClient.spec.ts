import { OrganizationMembership, OrganizationMembershipList, OrganizationRole, Pagination, Token } from '@/types'
import { OrganizationMembershipFactory, TokenFactory } from '../factories'
import CalendlyError from '@/errors/calendlyError'
import { OrganizationMembershipsClient } from '@'
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
          createdAt: new Date(orgMemberEntity.user.created_at),
          email: orgMemberEntity.user.email,
          name: orgMemberEntity.user.name,
          schedulingUrl: orgMemberEntity.user.scheduling_url,
          slug: orgMemberEntity.user.slug,
          timezone: orgMemberEntity.user.timezone,
          updatedAt: new Date(orgMemberEntity.user.updated_at),
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

describe('.list', () => {
  describe('when response status is ok', () => {
    describe('when organization is provided', () => {
      const organization = faker.internet.url()
      const pagination = {
        count: faker.random.number({ min: 1, max: 100 }),
        next_page: faker.internet.url()
      }
      const orgMemberEntity1 = OrganizationMembershipFactory.createEntity()
      const orgMemberEntity2 = OrganizationMembershipFactory.createEntity()
      const orgMemberEntity3 = OrganizationMembershipFactory.createEntity()

      beforeAll(() => {
        nock('https://api.calendly.com', {
          reqheaders: {
            authorization: `${token.tokenType} ${token.accessToken}`
          }
        }).get('/organization_memberships')
          .query({ organization })
          .reply(200, {
            collection: [
              orgMemberEntity1,
              orgMemberEntity2,
              orgMemberEntity3
            ],
            pagination
          })
      })

      it('returns a promise that resolves to expected result', async () => {
        const result: OrganizationMembershipList = await client.list({ organization })

        expect(result.pagination).toEqual<Pagination>({
          count: pagination.count,
          nextPage: pagination.next_page
        })

        expect(result.collection).toEqual<OrganizationMembership[]>([
          {
            uri: orgMemberEntity1.uri,
            role: orgMemberEntity1.role as OrganizationRole,
            user: {
              avatarUrl: orgMemberEntity1.user.avatar_url,
              createdAt: new Date(orgMemberEntity1.user.created_at),
              email: orgMemberEntity1.user.email,
              name: orgMemberEntity1.user.name,
              schedulingUrl: orgMemberEntity1.user.scheduling_url,
              slug: orgMemberEntity1.user.slug,
              timezone: orgMemberEntity1.user.timezone,
              updatedAt: new Date(orgMemberEntity1.user.updated_at),
              uri: orgMemberEntity1.user.uri
            },
            organization: orgMemberEntity1.organization,
            updatedAt: new Date(orgMemberEntity1.updated_at),
            createdAt: new Date(orgMemberEntity1.created_at)
          },
          {
            uri: orgMemberEntity2.uri,
            role: orgMemberEntity2.role as OrganizationRole,
            user: {
              avatarUrl: orgMemberEntity2.user.avatar_url,
              createdAt: new Date(orgMemberEntity2.user.created_at),
              email: orgMemberEntity2.user.email,
              name: orgMemberEntity2.user.name,
              schedulingUrl: orgMemberEntity2.user.scheduling_url,
              slug: orgMemberEntity2.user.slug,
              timezone: orgMemberEntity2.user.timezone,
              updatedAt: new Date(orgMemberEntity2.user.updated_at),
              uri: orgMemberEntity2.user.uri
            },
            organization: orgMemberEntity2.organization,
            updatedAt: new Date(orgMemberEntity2.updated_at),
            createdAt: new Date(orgMemberEntity2.created_at)
          },
          {
            uri: orgMemberEntity3.uri,
            role: orgMemberEntity3.role as OrganizationRole,
            user: {
              avatarUrl: orgMemberEntity3.user.avatar_url,
              createdAt: new Date(orgMemberEntity3.user.created_at),
              email: orgMemberEntity3.user.email,
              name: orgMemberEntity3.user.name,
              schedulingUrl: orgMemberEntity3.user.scheduling_url,
              slug: orgMemberEntity3.user.slug,
              timezone: orgMemberEntity3.user.timezone,
              updatedAt: new Date(orgMemberEntity3.user.updated_at),
              uri: orgMemberEntity3.user.uri
            },
            organization: orgMemberEntity3.organization,
            updatedAt: new Date(orgMemberEntity3.updated_at),
            createdAt: new Date(orgMemberEntity3.created_at)
          }
        ])
      })

      describe('when count is provided', () => {
        const count = faker.random.number({ min: 1, max: 20 })
        const pagination = {
          count: faker.random.number({ min: 1, max: 100 }),
          next_page: faker.internet.url()
        }
        const orgMemberEntity1 = OrganizationMembershipFactory.createEntity()
        const expectedPagination: Pagination = {
          count: pagination.count,
          nextPage: pagination.next_page
        }
        const expectedCollection: OrganizationMembership[] = [
          {
            uri: orgMemberEntity1.uri,
            role: orgMemberEntity1.role as OrganizationRole,
            user: {
              avatarUrl: orgMemberEntity1.user.avatar_url,
              createdAt: new Date(orgMemberEntity1.user.created_at),
              email: orgMemberEntity1.user.email,
              name: orgMemberEntity1.user.name,
              schedulingUrl: orgMemberEntity1.user.scheduling_url,
              slug: orgMemberEntity1.user.slug,
              timezone: orgMemberEntity1.user.timezone,
              updatedAt: new Date(orgMemberEntity1.user.updated_at),
              uri: orgMemberEntity1.user.uri
            },
            organization: orgMemberEntity1.organization,
            updatedAt: new Date(orgMemberEntity1.updated_at),
            createdAt: new Date(orgMemberEntity1.created_at)
          }
        ]
  
        beforeAll(() => {
          nock('https://api.calendly.com', {
            reqheaders: {
              authorization: `${token.tokenType} ${token.accessToken}`
            }
          }).get('/organization_memberships')
            .query({ organization, count })
            .reply(200, {
              collection: [ orgMemberEntity1 ],
              pagination
            })
        })
  
        it('returns a promise that resolves to expected result', async () => {
          const result: OrganizationMembershipList = await client.list({ organization, count })
  
          expect(result.collection).toEqual<OrganizationMembership[]>(expectedCollection)
          expect(result.pagination).toEqual<Pagination>(expectedPagination)
        })

        describe('when email is provided', () => {
          const email = faker.internet.email()
          const pagination = {
            count: faker.random.number({ min: 1, max: 100 }),
            next_page: faker.internet.url()
          }
          const orgMemberEntity1 = OrganizationMembershipFactory.createEntity()
          const expectedPagination: Pagination = {
            count: pagination.count,
            nextPage: pagination.next_page
          }
          const expectedCollection: OrganizationMembership[] = [
            {
              uri: orgMemberEntity1.uri,
              role: orgMemberEntity1.role as OrganizationRole,
              user: {
                avatarUrl: orgMemberEntity1.user.avatar_url,
                createdAt: new Date(orgMemberEntity1.user.created_at),
                email: orgMemberEntity1.user.email,
                name: orgMemberEntity1.user.name,
                schedulingUrl: orgMemberEntity1.user.scheduling_url,
                slug: orgMemberEntity1.user.slug,
                timezone: orgMemberEntity1.user.timezone,
                updatedAt: new Date(orgMemberEntity1.user.updated_at),
                uri: orgMemberEntity1.user.uri
              },
              organization: orgMemberEntity1.organization,
              updatedAt: new Date(orgMemberEntity1.updated_at),
              createdAt: new Date(orgMemberEntity1.created_at)
            }
          ]
    
          beforeAll(() => {
            nock('https://api.calendly.com', {
              reqheaders: {
                authorization: `${token.tokenType} ${token.accessToken}`
              }
            }).get('/organization_memberships')
              .query({ organization, count, email })
              .reply(200, {
                collection: [ orgMemberEntity1 ],
                pagination
              })
          })
    
          it('returns a promise that resolves to expected result', async () => {
            const result: OrganizationMembershipList = await client.list({ organization, count, email })
    
            expect(result.collection).toEqual<OrganizationMembership[]>(expectedCollection)
            expect(result.pagination).toEqual<Pagination>(expectedPagination)
          })

          describe('when page token is provided', () => {
            const pageToken = faker.random.uuid()
            const pagination = {
              count: faker.random.number({ min: 1, max: 100 }),
              next_page: faker.internet.url()
            }
            const orgMemberEntity1 = OrganizationMembershipFactory.createEntity()
            const expectedPagination: Pagination = {
              count: pagination.count,
              nextPage: pagination.next_page
            }
            const expectedCollection: OrganizationMembership[] = [
              {
                uri: orgMemberEntity1.uri,
                role: orgMemberEntity1.role as OrganizationRole,
                user: {
                  avatarUrl: orgMemberEntity1.user.avatar_url,
                  createdAt: new Date(orgMemberEntity1.user.created_at),
                  email: orgMemberEntity1.user.email,
                  name: orgMemberEntity1.user.name,
                  schedulingUrl: orgMemberEntity1.user.scheduling_url,
                  slug: orgMemberEntity1.user.slug,
                  timezone: orgMemberEntity1.user.timezone,
                  updatedAt: new Date(orgMemberEntity1.user.updated_at),
                  uri: orgMemberEntity1.user.uri
                },
                organization: orgMemberEntity1.organization,
                updatedAt: new Date(orgMemberEntity1.updated_at),
                createdAt: new Date(orgMemberEntity1.created_at)
              }
            ]
      
            beforeAll(() => {
              nock('https://api.calendly.com', {
                reqheaders: {
                  authorization: `${token.tokenType} ${token.accessToken}`
                }
              }).get('/organization_memberships')
                .query({
                  organization,
                  count,
                  email,
                  page_token: pageToken
                })
                .reply(200, {
                  collection: [ orgMemberEntity1 ],
                  pagination
                })
            })
      
            it('returns a promise that resolves to expected result', async () => {
              const result: OrganizationMembershipList = await client.list({ organization, count, email, pageToken })
      
              expect(result.collection).toEqual<OrganizationMembership[]>(expectedCollection)
              expect(result.pagination).toEqual<Pagination>(expectedPagination)
            })
          })
        })
      })
    })

    describe('when user is provided', () => {
      const user = faker.internet.url()
      const pagination = {
        count: faker.random.number({ min: 1, max: 100 }),
        next_page: faker.internet.url()
      }
      const orgMemberEntity1 = OrganizationMembershipFactory.createEntity()
      const orgMemberEntity2 = OrganizationMembershipFactory.createEntity()
      const orgMemberEntity3 = OrganizationMembershipFactory.createEntity()

      beforeAll(() => {
        nock('https://api.calendly.com', {
          reqheaders: {
            authorization: `${token.tokenType} ${token.accessToken}`
          }
        }).get('/organization_memberships')
          .query({ user })
          .reply(200, {
            collection: [
              orgMemberEntity1,
              orgMemberEntity2,
              orgMemberEntity3
            ],
            pagination
          })
      })

      it('returns a promise that resolves to expected result', async () => {
        const result: OrganizationMembershipList = await client.list({ user })

        expect(result.pagination).toEqual<Pagination>({
          count: pagination.count,
          nextPage: pagination.next_page
        })

        expect(result.collection).toEqual<OrganizationMembership[]>([
          {
            uri: orgMemberEntity1.uri,
            role: orgMemberEntity1.role as OrganizationRole,
            user: {
              avatarUrl: orgMemberEntity1.user.avatar_url,
              createdAt: new Date(orgMemberEntity1.user.created_at),
              email: orgMemberEntity1.user.email,
              name: orgMemberEntity1.user.name,
              schedulingUrl: orgMemberEntity1.user.scheduling_url,
              slug: orgMemberEntity1.user.slug,
              timezone: orgMemberEntity1.user.timezone,
              updatedAt: new Date(orgMemberEntity1.user.updated_at),
              uri: orgMemberEntity1.user.uri
            },
            organization: orgMemberEntity1.organization,
            updatedAt: new Date(orgMemberEntity1.updated_at),
            createdAt: new Date(orgMemberEntity1.created_at)
          },
          {
            uri: orgMemberEntity2.uri,
            role: orgMemberEntity2.role as OrganizationRole,
            user: {
              avatarUrl: orgMemberEntity2.user.avatar_url,
              createdAt: new Date(orgMemberEntity2.user.created_at),
              email: orgMemberEntity2.user.email,
              name: orgMemberEntity2.user.name,
              schedulingUrl: orgMemberEntity2.user.scheduling_url,
              slug: orgMemberEntity2.user.slug,
              timezone: orgMemberEntity2.user.timezone,
              updatedAt: new Date(orgMemberEntity2.user.updated_at),
              uri: orgMemberEntity2.user.uri
            },
            organization: orgMemberEntity2.organization,
            updatedAt: new Date(orgMemberEntity2.updated_at),
            createdAt: new Date(orgMemberEntity2.created_at)
          },
          {
            uri: orgMemberEntity3.uri,
            role: orgMemberEntity3.role as OrganizationRole,
            user: {
              avatarUrl: orgMemberEntity3.user.avatar_url,
              createdAt: new Date(orgMemberEntity3.user.created_at),
              email: orgMemberEntity3.user.email,
              name: orgMemberEntity3.user.name,
              schedulingUrl: orgMemberEntity3.user.scheduling_url,
              slug: orgMemberEntity3.user.slug,
              timezone: orgMemberEntity3.user.timezone,
              updatedAt: new Date(orgMemberEntity3.user.updated_at),
              uri: orgMemberEntity3.user.uri
            },
            organization: orgMemberEntity3.organization,
            updatedAt: new Date(orgMemberEntity3.updated_at),
            createdAt: new Date(orgMemberEntity3.created_at)
          }
        ])
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
      .get('/organization_memberships')
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

describe('.delete', () => {
  const uuid = faker.random.alphaNumeric(16)

  describe('when response status is no content', () => {
    beforeAll(() => {
      nock('https://api.calendly.com', {
        reqheaders: {
          authorization: `${token.tokenType} ${token.accessToken}`
        }
      }).delete(`/organization_memberships/${uuid}`).reply(204)
    })

    it('returns a promise that resolves', async () => {
      const result = client.delete(uuid)

      await expect(result).resolves.toBeUndefined()
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
      }).delete(`/organization_memberships/${uuid}`).reply(errorStatus, errorDetails)
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