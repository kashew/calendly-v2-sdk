import {
  EventTypesClient, OAuthClient, OrganizationMembershipsClient, ScheduledEventInviteesClient,
  ScheduledEventsClient, SchedulingLinksClient, UsersClient
} from 'src'
import { Token } from 'src/types'
import { TokenFactory } from './factories'
import faker from 'faker'

const clientId = faker.random.uuid()
const clientSecret = faker.random.uuid()
const token: Token = TokenFactory.create()

describe('EventTypesClient', () => {
  it('has EventTypesClient', () => {
    const client = new EventTypesClient(token)

    expect(client).toBeInstanceOf(EventTypesClient)
  })
})

describe('OAuthClient', () => {
  it('has OAuthClient', () => {
    const client = new OAuthClient(clientId, clientSecret)

    expect(client).toBeInstanceOf(OAuthClient)
  })
})

describe('OrganizationMembershipsClient', () => {
  it('has OrganizationMembershipsClient', () => {
    const client = new OrganizationMembershipsClient(token)

    expect(client).toBeInstanceOf(OrganizationMembershipsClient)
  })
})

describe('ScheduledEventsClient', () => {
  it('has ScheduledEventsClient', () => {
    const client = new ScheduledEventsClient(token)

    expect(client).toBeInstanceOf(ScheduledEventsClient)
  })
})

describe('ScheduledEventInviteesClient', () => {
  const scheduledEventUuid = faker.random.uuid()

  it('has ScheduledEventInviteesClient', () => {
    const client = new ScheduledEventInviteesClient(token, scheduledEventUuid)

    expect(client).toBeInstanceOf(ScheduledEventInviteesClient)
  })
})

describe('SchedulingLinksClient', () => {
  it('has SchedulingLinksClient', () => {
    const client = new SchedulingLinksClient(token)

    expect(client).toBeInstanceOf(SchedulingLinksClient)
  })
})

describe('UsersClient', () => {
  it('has UsersClient', () => {
    const client = new UsersClient(token)

    expect(client).toBeInstanceOf(UsersClient)
  })
})