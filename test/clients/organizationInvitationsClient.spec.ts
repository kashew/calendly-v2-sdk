import { OrganizationInvitation, OrganizationInvitationList, OrganizationInvitationSort, OrganizationInvitationStatus, Pagination, Token } from 'src/types'
import { OrganizationInvitationFactory, TokenFactory } from '../factories'
import CalendlyError from 'src/errors/calendlyError'
import { OrganizationInvitationsClient } from 'src'
import faker from 'faker'
import nock from 'nock'

const token: Token = TokenFactory.create()
const organizationUuid = faker.random.uuid()

const client = new OrganizationInvitationsClient(token, organizationUuid)

it('creates new calendly client', () => {
  expect(client).toBeInstanceOf(OrganizationInvitationsClient)
})

describe('.get', () => {
  describe('when response status is ok', () => {
    const uuid = faker.random.alphaNumeric(8)
    const invitationEntity = OrganizationInvitationFactory.createEntity()

    beforeAll(() => {
      nock(`https://api.calendly.com/organizations/${organizationUuid}`, {
        reqheaders: {
          authorization: `${token.tokenType} ${token.accessToken}`
        }
      }).get(`/invitations/${uuid}`)
      .reply(200, { resource: invitationEntity })
    })

    it('returns a promise that resolves to expected result', async () => {
      const result = client.get(uuid)

      await expect(result).resolves.toEqual<OrganizationInvitation>({
        uri: invitationEntity.uri,
        organization: invitationEntity.organization,
        email: invitationEntity.email,
        status: invitationEntity.status as OrganizationInvitationStatus,
        createdAt: new Date(invitationEntity.created_at),
        updatedAt: new Date(invitationEntity.updated_at),
        lastSentAt: new Date(invitationEntity.last_sent_at),
        user: invitationEntity.user
      })
    })

    describe('when last sent at is null', () => {
      const uuid = faker.random.alphaNumeric(8)
      const invitationEntity = OrganizationInvitationFactory.createEntity()

      beforeAll(() => {
        invitationEntity.last_sent_at = null

        nock(`https://api.calendly.com/organizations/${organizationUuid}`, {
          reqheaders: {
            authorization: `${token.tokenType} ${token.accessToken}`
          }
        }).get(`/invitations/${uuid}`)
        .reply(200, { resource: invitationEntity })
      })

      it('returns a promise that resolves to expected result', async () => {
        const result = client.get(uuid)

        await expect(result).resolves.toEqual<OrganizationInvitation>({
          uri: invitationEntity.uri,
          organization: invitationEntity.organization,
          email: invitationEntity.email,
          status: invitationEntity.status as OrganizationInvitationStatus,
          createdAt: new Date(invitationEntity.created_at),
          updatedAt: new Date(invitationEntity.updated_at),
          lastSentAt: null,
          user: invitationEntity.user
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
      nock(`https://api.calendly.com/organizations/${organizationUuid}`, {
        reqheaders: {
          authorization: `${token.tokenType} ${token.accessToken}`
        }
      }).get(`/invitations/${uuid}`).reply(errorStatus, errorDetails)
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
    const pagination = {
      count: faker.random.number({ min: 1, max: 100 }),
      next_page: faker.internet.url()
    }
    const invitationEntity1 = OrganizationInvitationFactory.createEntity()
    const invitationEntity2 = OrganizationInvitationFactory.createEntity()
    const invitationEntity3 = OrganizationInvitationFactory.createEntity()

    beforeAll(() => {
      nock(`https://api.calendly.com/organizations/${organizationUuid}`, {
        reqheaders: {
          authorization: `${token.tokenType} ${token.accessToken}`
        }
      }).get('/invitations')
        .reply(200, {
          collection: [
            invitationEntity1,
            invitationEntity2,
            invitationEntity3
          ],
          pagination
        })
    })

    it('returns a promise that resolves to expected result', async () => {
      const result: OrganizationInvitationList = await client.list()

      expect(result.pagination).toEqual<Pagination>({
        count: pagination.count,
        nextPage: pagination.next_page
      })

      expect(result.collection).toEqual<OrganizationInvitation[]>([
        {
          uri: invitationEntity1.uri,
          organization: invitationEntity1.organization,
          email: invitationEntity1.email,
          status: invitationEntity1.status as OrganizationInvitationStatus,
          createdAt: new Date(invitationEntity1.created_at),
          updatedAt: new Date(invitationEntity1.updated_at),
          lastSentAt: new Date(invitationEntity1.last_sent_at),
          user: invitationEntity1.user
        },
        {
          uri: invitationEntity2.uri,
          organization: invitationEntity2.organization,
          email: invitationEntity2.email,
          status: invitationEntity2.status as OrganizationInvitationStatus,
          createdAt: new Date(invitationEntity2.created_at),
          updatedAt: new Date(invitationEntity2.updated_at),
          lastSentAt: new Date(invitationEntity2.last_sent_at),
          user: invitationEntity2.user
        },
        {
          uri: invitationEntity3.uri,
          organization: invitationEntity3.organization,
          email: invitationEntity3.email,
          status: invitationEntity3.status as OrganizationInvitationStatus,
          createdAt: new Date(invitationEntity3.created_at),
          updatedAt: new Date(invitationEntity3.updated_at),
          lastSentAt: new Date(invitationEntity3.last_sent_at),
          user: invitationEntity3.user
        }
      ])
    })

    describe('when count is provided', () => {
      const count = faker.random.number({ min: 1, max: 20 })

      beforeAll(() => {
        nock(`https://api.calendly.com/organizations/${organizationUuid}`, {
          reqheaders: {
            authorization: `${token.tokenType} ${token.accessToken}`
          }
        }).get('/invitations')
          .query({ count })
          .reply(200, {
            collection: [
              invitationEntity1
            ],
            pagination
          })
      })

      it('returns a promise that resolves to expected result', async () => {
        const result: OrganizationInvitationList = await client.list({ count })
  
        expect(result.pagination).toEqual<Pagination>({
          count: pagination.count,
          nextPage: pagination.next_page
        })
  
        expect(result.collection).toEqual<OrganizationInvitation[]>([
          {
            uri: invitationEntity1.uri,
            organization: invitationEntity1.organization,
            email: invitationEntity1.email,
            status: invitationEntity1.status as OrganizationInvitationStatus,
            createdAt: new Date(invitationEntity1.created_at),
            updatedAt: new Date(invitationEntity1.updated_at),
            lastSentAt: new Date(invitationEntity1.last_sent_at),
            user: invitationEntity1.user
          }
        ])
      })

      describe('when email is provided', () => {
        const email = faker.internet.email()
  
        beforeAll(() => {
          nock(`https://api.calendly.com/organizations/${organizationUuid}`, {
            reqheaders: {
              authorization: `${token.tokenType} ${token.accessToken}`
            }
          }).get('/invitations')
            .query({ count, email })
            .reply(200, {
              collection: [
                invitationEntity1
              ],
              pagination
            })
        })
  
        it('returns a promise that resolves to expected result', async () => {
          const result: OrganizationInvitationList = await client.list({ count, email })
    
          expect(result.pagination).toEqual<Pagination>({
            count: pagination.count,
            nextPage: pagination.next_page
          })
    
          expect(result.collection).toEqual<OrganizationInvitation[]>([
            {
              uri: invitationEntity1.uri,
              organization: invitationEntity1.organization,
              email: invitationEntity1.email,
              status: invitationEntity1.status as OrganizationInvitationStatus,
              createdAt: new Date(invitationEntity1.created_at),
              updatedAt: new Date(invitationEntity1.updated_at),
              lastSentAt: new Date(invitationEntity1.last_sent_at),
              user: invitationEntity1.user
            }
          ])
        })

        describe('when page token is provided', () => {
          const pageToken = faker.random.uuid()
    
          beforeAll(() => {
            nock(`https://api.calendly.com/organizations/${organizationUuid}`, {
              reqheaders: {
                authorization: `${token.tokenType} ${token.accessToken}`
              }
            }).get('/invitations')
              .query({ count, email, page_token: pageToken })
              .reply(200, {
                collection: [
                  invitationEntity1
                ],
                pagination
              })
          })
    
          it('returns a promise that resolves to expected result', async () => {
            const result: OrganizationInvitationList = await client.list({ count, email, pageToken })
      
            expect(result.pagination).toEqual<Pagination>({
              count: pagination.count,
              nextPage: pagination.next_page
            })
      
            expect(result.collection).toEqual<OrganizationInvitation[]>([
              {
                uri: invitationEntity1.uri,
                organization: invitationEntity1.organization,
                email: invitationEntity1.email,
                status: invitationEntity1.status as OrganizationInvitationStatus,
                createdAt: new Date(invitationEntity1.created_at),
                updatedAt: new Date(invitationEntity1.updated_at),
                lastSentAt: new Date(invitationEntity1.last_sent_at),
                user: invitationEntity1.user
              }
            ])
          })

          describe('when sort is provided', () => {
            const sort = faker.random.arrayElement(['created_at:asc', 'created_at:desc']) as OrganizationInvitationSort
      
            beforeAll(() => {
              nock(`https://api.calendly.com/organizations/${organizationUuid}`, {
                reqheaders: {
                  authorization: `${token.tokenType} ${token.accessToken}`
                }
              }).get('/invitations')
                .query({ count, email, page_token: pageToken, sort })
                .reply(200, {
                  collection: [ invitationEntity1 ],
                  pagination
                })
            })
      
            it('returns a promise that resolves to expected result', async () => {
              const result: OrganizationInvitationList = await client.list({ count, email, pageToken, sort })
        
              expect(result.pagination).toEqual<Pagination>({
                count: pagination.count,
                nextPage: pagination.next_page
              })
        
              expect(result.collection).toEqual<OrganizationInvitation[]>([
                {
                  uri: invitationEntity1.uri,
                  organization: invitationEntity1.organization,
                  email: invitationEntity1.email,
                  status: invitationEntity1.status as OrganizationInvitationStatus,
                  createdAt: new Date(invitationEntity1.created_at),
                  updatedAt: new Date(invitationEntity1.updated_at),
                  lastSentAt: new Date(invitationEntity1.last_sent_at),
                  user: invitationEntity1.user
                }
              ])
            })

            describe('when status is provided', () => {
              const status = faker.random.arrayElement(['accepted', 'declined', 'pending']) as OrganizationInvitationStatus
        
              beforeAll(() => {
                nock(`https://api.calendly.com/organizations/${organizationUuid}`, {
                  reqheaders: {
                    authorization: `${token.tokenType} ${token.accessToken}`
                  }
                }).get('/invitations')
                  .query({ count, email, page_token: pageToken, sort, status })
                  .reply(200, {
                    collection: [ invitationEntity1 ],
                    pagination
                  })
              })
        
              it('returns a promise that resolves to expected result', async () => {
                const result: OrganizationInvitationList = await client.list({ count, email, pageToken, sort, status })
          
                expect(result.pagination).toEqual<Pagination>({
                  count: pagination.count,
                  nextPage: pagination.next_page
                })
          
                expect(result.collection).toEqual<OrganizationInvitation[]>([
                  {
                    uri: invitationEntity1.uri,
                    organization: invitationEntity1.organization,
                    email: invitationEntity1.email,
                    status: invitationEntity1.status as OrganizationInvitationStatus,
                    createdAt: new Date(invitationEntity1.created_at),
                    updatedAt: new Date(invitationEntity1.updated_at),
                    lastSentAt: new Date(invitationEntity1.last_sent_at),
                    user: invitationEntity1.user
                  }
                ])
              })
            })
          })
        })
      })
    })
  })

  describe('when response status is not okay', () => {
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
      nock(`https://api.calendly.com/organizations/${organizationUuid}`, {
        reqheaders: {
          authorization: `${token.tokenType} ${token.accessToken}`
        }
      })
      .get('/invitations')
      .reply(errorStatus, errorDetails)
    })

    it('returns a promise that rejects', async () => {
      let result: CalendlyError

      try {
        await client.list()
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
  const email = faker.internet.email()
  
  describe('when response status is ok', () => {
    const invitationEntity = OrganizationInvitationFactory.createEntity()

    beforeAll(() => {
      nock(`https://api.calendly.com/organizations/${organizationUuid}`, {
        reqheaders: {
          authorization: `${token.tokenType} ${token.accessToken}`
        }
      }).post('/invitations', {
        email
      })
      .reply(201, { resource: invitationEntity })
    })
    
    it('returns a promise that resolves', async () => {
      const result = client.create({ email })

      await expect(result).resolves.toEqual<OrganizationInvitation>({
        uri: invitationEntity.uri,
        organization: invitationEntity.organization,
        email: invitationEntity.email,
        status: invitationEntity.status as OrganizationInvitationStatus,
        createdAt: new Date(invitationEntity.created_at),
        updatedAt: new Date(invitationEntity.updated_at),
        lastSentAt: new Date(invitationEntity.last_sent_at),
        user: invitationEntity.user
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
      nock(`https://api.calendly.com/organizations/${organizationUuid}`, {
        reqheaders: {
          authorization: `${token.tokenType} ${token.accessToken}`
        }
      })
      .post('/invitations', {
        email
      })
      .reply(errorStatus, errorDetails)
    })

    it('returns a promise that rejects', async () => {
      let result: CalendlyError

      try {
        await client.create({ email })
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
      nock(`https://api.calendly.com/organizations/${organizationUuid}`, {
        reqheaders: {
          authorization: `${token.tokenType} ${token.accessToken}`
        }
      }).delete(`/invitations/${uuid}`).reply(204)
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
      nock(`https://api.calendly.com/organizations/${organizationUuid}`, {
        reqheaders: {
          authorization: `${token.tokenType} ${token.accessToken}`
        }
      }).delete(`/invitations/${uuid}`).reply(errorStatus, errorDetails)
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