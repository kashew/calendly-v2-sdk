import * as dotenv from 'dotenv'
import {
  PaginationEntity,
  Token, WebhookSubscription, WebhookSubscriptionCreateOptions, WebhookSubscriptionEntity, WebhookSubscriptionEvent,
  WebhookSubscriptionList,
  WebhookSubscriptionOptions,
  WebhookSubscriptionScope, WebhookSubscriptionState
} from '../types'
import { AxiosResponse } from 'axios'
import BaseClient from './baseClient'

/**
 * Client used for accessing Webhook Subscription resource data
 */
export default class WebhookSubscriptionsClient extends BaseClient {
  constructor(token: Token) {
    dotenv.config()
    const baseUrl = process.env.CALENDLY_BASE_URL ?? BaseClient.CALENDLY_BASE_URL

    super(token, baseUrl)
  }

  /**
   * Creates a new Webhook Subscription
   * @param options - WebhookSubscriptionCreateOptions
   */
  public async create(options: WebhookSubscriptionCreateOptions): Promise<WebhookSubscription> {
    let response: AxiosResponse<{ resource: WebhookSubscriptionEntity }>

    try {
      response = await this.calendlyApi.post('/webhook_subscriptions', {
        url: options.url,
        events: options.events,
        organization: options.organization,
        user: options.user,
        scope: options.scope
      })
    } catch (e) {
      throw this.getCalendlyError(e)
    }

    return this.getWebhookSubscription(response.data.resource)
  }

  /**
   * Deletes the Webhook Subscription associated with the specified UUID
   * @param uuid - UUID of Webhook Subscription
   */
  public async delete(uuid: string): Promise<void> {
    try {
      await this.calendlyApi.delete(`/webhook_subscriptions/${uuid}`)
    } catch (e) {
      throw this.getCalendlyError(e)
    }
  }

  /**
   * Returns the Webhook Subscription associated with the specified UUID
   * @param uuid - UUID of Webhook Subscription
   */
  public async get(uuid: string): Promise<WebhookSubscription> {
    let response: AxiosResponse<{ resource: WebhookSubscriptionEntity }>

    try {
      response = await this.calendlyApi.get(`/webhook_subscriptions/${uuid}`)
    } catch (e) {
      throw this.getCalendlyError(e)
    }

    return this.getWebhookSubscription(response.data.resource)
  }

  /**
   * Returns a list of Webhook Subscriptions
   * @param options - WebhookSubscriptionOptions
   */
  public async list(options: WebhookSubscriptionOptions): Promise<WebhookSubscriptionList> {
    let response: AxiosResponse<{ collection: WebhookSubscriptionEntity[], pagination: PaginationEntity }>

    try {
      response = await this.calendlyApi.get('/webhook_subscriptions', {
        params: {
          organization: options.organization,
          user: options.user,
          scope: options.scope,
          count: options.count,
          page_token: options.pageToken,
          sort: options.sort
        }
      })
    } catch (e) {
      throw this.getCalendlyError(e)
    }

    const entities: WebhookSubscriptionEntity[] = response.data.collection

    const pagination = this.getPagination(response.data.pagination)
    const collection = entities.map(entity => {
      return this.getWebhookSubscription(entity)
    })

    return {
      collection,
      pagination
    }
  }

  private getWebhookSubscription(entity: WebhookSubscriptionEntity): WebhookSubscription {
    return {
      uri: entity.uri,
      callbackUrl: entity.callback_url,
      createdAt: new Date(entity.created_at),
      updatedAt: new Date(entity.updated_at),
      retryStartedAt: new Date(entity.retry_started_at),
      state: entity.state as WebhookSubscriptionState,
      events: entity.events.map(e => e as WebhookSubscriptionEvent),
      scope: entity.scope as WebhookSubscriptionScope,
      organization: entity.organization,
      user: entity.user,
      creator: entity.creator
    }
  }
}