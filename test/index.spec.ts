import faker from 'faker'
import { TokenFactory } from './factories'
import { EventTypesClient, OAuthClient, ScheduledEventInviteesClient, SchedulingLinksClient, ScheduledEventsClient, UsersClient } from 'src'
import { Token } from 'src/types'

const clientId = faker.random.uuid()
const clientSecret = faker.random.uuid()
const token: Token = TokenFactory.create()

describe('OAuthClient', () => {
  it('has OAuthClient', () => {
    const client = new OAuthClient(clientId, clientSecret)

    expect(client).toBeInstanceOf(OAuthClient)
  })
})

describe('EventTypesClient', () => {
  it('has EventTypesClient', () => {
    const client = new EventTypesClient(token)

    expect(client).toBeInstanceOf(EventTypesClient)
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