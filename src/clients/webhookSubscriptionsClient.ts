import * as dotenv from 'dotenv'
import {
  Token, WebhookSubscription, WebhookSubscriptionEntity, WebhookSubscriptionEvent,
  WebhookSubscriptionScope, WebhookSubscriptionState
} from 'src/types'
import { AxiosResponse } from 'axios'
import BaseClient from './baseClient'

export default class WebhookSubscriptionsClient extends BaseClient {
  constructor(token: Token) {
    dotenv.config()
    const baseUrl = process.env.CALENDLY_BASE_URL ?? BaseClient.CALENDLY_BASE_URL

    super(token, baseUrl)
  }

  public async get(uuid: string): Promise<WebhookSubscription> {
    let response: AxiosResponse<{ resource: WebhookSubscriptionEntity }>

    try {
      response = await this.calendlyApi.get(`/webhook_subscriptions/${uuid}`)
    } catch (e) {
      throw this.getCalendlyError(e)
    }

    return this.getWebhookSubscription(response.data.resource)
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