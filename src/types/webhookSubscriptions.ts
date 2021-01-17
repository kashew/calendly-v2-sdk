import { Pagination } from '.'

export type WebhookSubscription = {
  uri: string
  callbackUrl: string
  createdAt: Date
  updatedAt: Date
  retryStartedAt: Date
  state: WebhookSubscriptionState
  events: WebhookSubscriptionEvent[]
  scope: WebhookSubscriptionScope
  organization: string
  user: string
  creator: string
}

export type WebhookSubscriptionEntity = {
  uri: string
  callback_url: string
  created_at: string
  updated_at: string
  retry_started_at: string
  state: string
  events: string[]
  scope: string
  organization: string
  user: string
  creator: string
}

export enum WebhookSubscriptionEvent {
  InviteeCreated = 'invitee.created',
  InviteeCanceled = 'invitee.canceled'
}

export type WebhookSubscriptionList = {
  collection: WebhookSubscription[]
  pagination: Pagination
}

export type WebhookSubscriptionCreateOptions = {
  url: string
  events: WebhookSubscriptionEvent[]
  organization: string
  user?: string
  scope: WebhookSubscriptionScope
}

export type WebhookSubscriptionOptions = {
  organization: string
  scope: WebhookSubscriptionScope
  count?: number
  pageToken?: string
  sort?: WebhookSubscriptionSort
  user?: string
}

export enum WebhookSubscriptionScope {
  Organization = 'organization',
  User = 'user'
}

export enum WebhookSubscriptionSort {
  CreatedAtAscending = 'created_at:asc',
  CreatedAtDescending = 'created_at:desc'
}

export enum WebhookSubscriptionState {
  Active = 'active',
  Disabled = 'disabled'
}