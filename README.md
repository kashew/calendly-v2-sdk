# Calendly V2 SDK

Library to give developers a pleasurable integration experience with Calendly's v2 API.  For more information about Calendly v2 API, please visit [Calendly's Developer Portal](https://developer.calendly.com).

<a href="https://www.buymeacoffee.com/kashew" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png" alt="Buy Me A Coffee" style="height: 41px !important;width: 174px !important;box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;-webkit-box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;" ></a>

## Installation
`npm i -S @kashew/calendly-v2-sdk`

## Usage
For every resource offered by Calendly's v2 API, there exists a client for accessing that resource:
```
import {
  OAuthClient,
  EventTypesClient,
  OrganizationInvitationsClient,
  OrganizationMembershipsClient,
  ScheduledEventsClient,
  ScheduledEventInviteesClient,
  SchedulingLinksClient,
  UsersClient,
  WebhookSubscriptionsClient
} from '@kashew/calendly-v2-sdk'
```

---

## OAuthClient
Client used for making various calls concerning OAuth.

This client cannot handle the various front-end calls that needs to happen in order to get a code, but once you have a code, this client can handle the exchange for an access token along with subsequent refresh calls.

> More details about this client can be found on the Wiki page:<br />
> **[Wiki - OAuthClient](https://github.com/kashew/calendly-v2-sdk/wiki/OAuthClient)**

***Parameters***
* **clientId (string)** - Client ID provided by Calendly
* **clientSecret (string)** - Client Secret provided by Calendly

***Example Usage***

```typescript
/**
 * Your Client ID and Client Secret are unique to you and should have been
 * provided when you requested access to Calendly's v2 API.
 */
const clientId = '<my_client_id>'
const clientSecret = '<my_client_secret>'

const client = new OAuthClient(clientId, clientSecret)
```

### Method Signatures

`async token(options: TokenOptions) : Promise<Token>`
> Calendly's v2 API Documentation:
> **[Get Access Token](https://calendly.stoplight.io/docs/api-docs/reference/calendly-api/oauth.yaml/paths/~1oauth~1token/post)**

<br />

`async introspect(token: string): Promise<IntrospectResponse>`
> Calendly's v2 API Documentation:
> **[Introspect Access/Refresh Token](https://calendly.stoplight.io/docs/api-docs/reference/calendly-api/oauth.yaml/paths/~1oauth~1introspect/post)**

<br />

`async revoke(token: string): Promise<void>`
> Calendly's v2 API Documentation:
> **[Revoke Access/Refresh Token](https://calendly.stoplight.io/docs/api-docs/reference/calendly-api/oauth.yaml/paths/~1oauth~1revoke/post)**

---

## EventTypesClient
Client used for accessing Event Type resource data

> More details about this client can be found on the Wiki page:<br />
> **[Wiki - EventTypesClient](https://github.com/kashew/calendly-v2-sdk/wiki/EventTypesClient)**

***Parameters***
* **token (Token)** - Access Token that can be retrieved using the OAuthClient

***Example Usage***
```typescript
const oauthClient = new OAuthClient(clientId, clientSecret)
const token = oauthClient.token({...})

const client = new EventTypesClient(token)
```

### Method Signatures
`async get(uuid: string): Promise<EventType>`
> Calendly's v2 API Documentation:
> **[Get Event Type](https://calendly.stoplight.io/docs/api-docs/reference/calendly-api/openapi.yaml/paths/~1event_types~1%7Buuid%7D/get)**

<br />

`async list(options: EventTypeOptions): Promise<EventTypeList>`
> Calendly's v2 API Documentation:
> **[List Event Types](https://calendly.stoplight.io/docs/api-docs/reference/calendly-api/openapi.yaml/paths/~1event_types/get)**

---

## OrganizationInvitationsClient
Client used for accessing Organization Invitation resource data

> More details about this client can be found on the Wiki page:<br />
> **[Wiki - OrganizationInvitationsClient](https://github.com/kashew/calendly-v2-sdk/wiki/OrganizationInvitationsClient)**

***Parameters***
* **token (Token)** - Access Token that can be retrieved using the OAuthClient
* **organizationUuid** - UUID of the Organization

***Example Usage***
```typescript
const oauthClient = new OAuthClient(clientId, clientSecret)
const token = oauthClient.token({...})

const organizationUuid = '<organization_uuid>'

const client = new OrganizationInvitationsClient(token, organizationUuid)
```

### Method Signatures
`async create(options: OrganizationInvitationCreateOptions): Promise<OrganizationInvitation>`
> Calendly's v2 API Documentation:
> **[Invite User to Organization](https://calendly.stoplight.io/docs/api-docs/reference/calendly-api/openapi.yaml/paths/~1organizations~1%7Buuid%7D~1invitations/post)**

<br />

`async delete(uuid: string): Promise<void>`
> Calendly's v2 API Documentation:
> **[Revoke User's Organization Invitation](https://calendly.stoplight.io/docs/api-docs/reference/calendly-api/openapi.yaml/paths/~1organizations~1%7Borg_uuid%7D~1invitations~1%7Buuid%7D/delete)**

<br />

`async get(uuid: string): Promise<OrganizationInvitation>`
> Calendly's v2 API Documentation:
> **[Get Organization Invitation](https://calendly.stoplight.io/docs/api-docs/reference/calendly-api/openapi.yaml/paths/~1organizations~1%7Borg_uuid%7D~1invitations~1%7Buuid%7D/get)**

<br />

`async list(options: OrganizationInvitationOptions = {}): Promise<OrganizationInvitationList>`
> Calendly's v2 API Documentation:
> **[List Organization Invitations](https://calendly.stoplight.io/docs/api-docs/reference/calendly-api/openapi.yaml/paths/~1organizations~1%7Buuid%7D~1invitations/get)**

---

## OrganizationMembershipsClient
Client used for accessing Organization Membership resource data

> More details about this client can be found on the Wiki page:<br />
> **[Wiki - OrganizationMembershipsClient](https://github.com/kashew/calendly-v2-sdk/wiki/OrganizationMembershipsClient)**

***Parameters***
* **token (Token)** - Access Token that can be retrieved using the OAuthClient

***Example Usage***
```typescript
const oauthClient = new OAuthClient(clientId, clientSecret)
const token = oauthClient.token({...})

const client = new OrganizationMembershipsClient(token)
```

### Method Signatures
`async delete(uuid: string): Promise<void>`
> Calendly's v2 API Documentation:
> **[Remove User from Organization](https://calendly.stoplight.io/docs/api-docs/reference/calendly-api/openapi.yaml/paths/~1organization_memberships~1%7Buuid%7D/delete)**

<br />

`async get(uuid: string): Promise<OrganizationMembership>`
> Calendly's v2 API Documentation:
> **[Get Organization Membership](https://calendly.stoplight.io/docs/api-docs/reference/calendly-api/openapi.yaml/paths/~1organization_memberships~1%7Buuid%7D/get)**

<br />

`async list(options: OrganizationMembershipOptions): Promise<OrganizationMembershipList>`
> Calendly's v2 API Documentation:
> **[List Organization Memberships](https://calendly.stoplight.io/docs/api-docs/reference/calendly-api/openapi.yaml/paths/~1organization_memberships/get)**

---

## ScheduledEventsClient
Client used for accessing Scheduled Event resource data

> More details about this client can be found on the Wiki page:<br />
> **[Wiki - ScheduledEventsClient](https://github.com/kashew/calendly-v2-sdk/wiki/ScheduledEventsClient)**

***Parameters***
* **token (Token)** - Access Token that can be retrieved using the OAuthClient

***Example Usage***
```typescript
const oauthClient = new OAuthClient(clientId, clientSecret)
const token = oauthClient.token({...})

const client = new ScheduledEventsClient(token)
```

### Method Signatures
`async get(uuid: string): Promise<ScheduledEvent>`
> Calendly's v2 API Documentation:
> **[Get Event](https://calendly.stoplight.io/docs/api-docs/reference/calendly-api/openapi.yaml/paths/~1scheduled_events~1%7Buuid%7D/get)**

<br />

`async list(options: ScheduledEventOptions): Promise<ScheduledEventList>`
> Calendly's v2 API Documentation:
> **[List Events](https://calendly.stoplight.io/docs/api-docs/reference/calendly-api/openapi.yaml/paths/~1scheduled_events/get)**

---

## ScheduledEventInviteesClient
Client used for accessing a Scheduled Event's Invitee resource data

> More details about this client can be found on the Wiki page:<br />
> **[Wiki - ScheduledEventInviteesClient](https://github.com/kashew/calendly-v2-sdk/wiki/ScheduledEventInviteesClient)**

***Parameters***
* **token (Token)** - Access Token that can be retrieved using the OAuthClient
* **scheduledEventUuid (string)** - UUID of Scheduled Event

***Example Usage***
```typescript
const oauthClient = new OAuthClient(clientId, clientSecret)
const token = oauthClient.token({...})

const scheduledEventUuid = '<scheduled_event_uuid>'

const client = new ScheduledEventInviteesClient(token, scheduledEventUuid)
```

### Method Signatures

`async get(uuid: string): Promise<Invitee>`
> Calendly's v2 API Documentation:
> **[Get Event Invitee](https://calendly.stoplight.io/docs/api-docs/reference/calendly-api/openapi.yaml/paths/~1scheduled_events~1%7Bevent_uuid%7D~1invitees~1%7Binvitee_uuid%7D/get)**

<br />

`async list(options: InviteeOptions = {}): Promise<InviteeList>`
> Calendly's v2 API Documentation:
> **[List Event Invitees](https://calendly.stoplight.io/docs/api-docs/reference/calendly-api/openapi.yaml/paths/~1scheduled_events~1%7Buuid%7D~1invitees/get)**

---

## SchedulingLinksClient
Client used for accessing Scheduling Link resource data

> More details about this client can be found on the Wiki page:<br />
> **[Wiki - SchedulingLinksClient](https://github.com/kashew/calendly-v2-sdk/wiki/SchedulingLinksClient)**

***Parameters***
* **token (Token)** - Access Token that can be retrieved using the OAuthClient

***Example Usage***
```typescript
const oauthClient = new OAuthClient(clientId, clientSecret)
const token = oauthClient.token({...})

const client = new SchedulingLinksClient(token)
```

### Method Signatures
`async create(options: SchedulingLinkCreateOptions): Promise<SchedulingLink>`
> Calendly's v2 API Documentation:
> **[Create Scheduling Link](https://calendly.stoplight.io/docs/api-docs/reference/calendly-api/openapi.yaml/paths/~1scheduling_links/post)**

---

## UsersClient
Client used for accessing User resource data

> More details about this client can be found on the Wiki page:<br />
> **[Wiki - UsersClient](https://github.com/kashew/calendly-v2-sdk/wiki/UsersClient)**

***Parameters***
* **token (Token)** - Access Token that can be retrieved using the OAuthClient

***Example Usage***
```typescript
const oauthClient = new OAuthClient(clientId, clientSecret)
const token = oauthClient.token({...})

const client = new UsersClient(token)
```

### Method Signatures
`async get(uuid: string): Promise<User>`
> Calendly's v2 API Documentation:
> **[Get User](https://calendly.stoplight.io/docs/api-docs/reference/calendly-api/openapi.yaml/paths/~1users~1%7Buuid%7D/get)**

<br />

`async me(): Promise<User>`
> Calendly's v2 API Documentation:
> **[Get Current User](https://calendly.stoplight.io/docs/api-docs/reference/calendly-api/openapi.yaml/paths/~1users~1me/get)**

---

## WebhookSubscriptionsClient
Client used for accessing Webhook Subscription resource data

> More details about this client can be found on the Wiki page:<br />
> **[Wiki - WebhookSubscriptionsClient](https://github.com/kashew/calendly-v2-sdk/wiki/WebhookSubscriptionsClient)**

***Parameters***
* **token (Token)** - Access Token that can be retrieved using the OAuthClient

***Example Usage***
```typescript
const oauthClient = new OAuthClient(clientId, clientSecret)
const token = oauthClient.token({...})

const client = new WebhookSubscriptionsClient(token)
```

### Method Signatures
`async create(options: WebhookSubscriptionCreateOptions): Promise<WebhookSubscription>`
> Calendly's v2 API Documentation:
> **[Create Webhook Subscription](https://calendly.stoplight.io/docs/api-docs/reference/calendly-api/openapi.yaml/paths/~1webhook_subscriptions/post)**

`async delete(uuid: string): Promise<void>`
> Calendly's v2 API Documentation:
> **[Delete Webhook Subscription](https://calendly.stoplight.io/docs/api-docs/reference/calendly-api/openapi.yaml/paths/~1webhook_subscriptions~1%7Bwebhook_uuid%7D/delete)**

`async get(uuid: string): Promise<WebhookSubscription>`
> Calendly's v2 API Documentation:
> **[Get Webhook Subscription](https://calendly.stoplight.io/docs/api-docs/reference/calendly-api/openapi.yaml/paths/~1webhook_subscriptions~1%7Bwebhook_uuid%7D/get)**

`async list(options: WebhookSubscriptionOptions): Promise<WebhookSubscriptionList>`
> Calendly's v2 API Documentation:
> **[List Webhook Subscriptions](https://calendly.stoplight.io/docs/api-docs/reference/calendly-api/openapi.yaml/paths/~1webhook_subscriptions/get)**
