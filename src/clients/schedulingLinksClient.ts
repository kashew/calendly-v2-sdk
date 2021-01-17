import * as dotenv from 'dotenv'
import { SchedulingLink, SchedulingLinkCreateOptions, SchedulingLinkEntity, SchedulingLinkOwnerType, Token } from 'src/types'
import { AxiosResponse } from 'axios'
import BaseClient from './baseClient'

export default class SchedulingLinksClient extends BaseClient {
  constructor(token: Token) {
    dotenv.config()
    const baseUrl = process.env.CALENDLY_BASE_URL ?? BaseClient.CALENDLY_BASE_URL

    super(token, baseUrl)
  }

  public async create(options: SchedulingLinkCreateOptions): Promise<SchedulingLink> {
    let response: AxiosResponse<{ resource: SchedulingLinkEntity }>

    try {
      response = await this.calendlyApi.post('/scheduling_links', {
        max_event_count: options.maxEventCount,
        owner: options.owner,
        owner_type: options.ownerType
      })
    } catch (e) {
      throw this.getCalendlyError(e)
    }

    return this.getSchedulingLink(response.data.resource)
  }

  private getSchedulingLink(entity: SchedulingLinkEntity): SchedulingLink {
    return {
      bookingUrl: entity.booking_url,
      owner: entity.owner,
      ownerType: entity.owner_type as SchedulingLinkOwnerType
    }
  }
}