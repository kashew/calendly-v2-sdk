import * as dotenv from 'dotenv'
import {
  EventType, EventTypeEntity, EventTypeList, EventTypeOptions, EventTypeType,
  Kind, PaginationEntity, PoolingType, Profile, ProfileEntity, ProfileType, Token
} from '../types'
import { AxiosResponse } from 'axios'
import BaseClient from './baseClient'

/**
 * Client used for accessing Event Type resource data
 */
export default class EventTypesClient extends BaseClient {
  constructor(token: Token) {
    dotenv.config()
    const baseUrl = process.env.CALENDLY_BASE_URL ?? BaseClient.CALENDLY_BASE_URL

    super(token, baseUrl)
  }
  
  /**
   * Returns the Event Type associated with the specified UUID
   * @param uuid - UUID of Event Type
   */
  public async get(uuid: string): Promise<EventType> {
    let response: AxiosResponse<{ resource: EventTypeEntity }>

    try {
      response = await this.calendlyApi.get(`/event_types/${uuid}`)
    } catch (e) {
      throw this.getCalendlyError(e)
    }

    return this.getEventType(response.data.resource)
  }

  /**
   * Returns all Event Types associated with a specified User
   * @param options - EventTypeOptions
   */
  public async list(options: EventTypeOptions): Promise<EventTypeList> {
    let response: AxiosResponse<{
      pagination: PaginationEntity,
      collection: EventTypeEntity[]
    }>

    try {
      response = await this.calendlyApi.get('/event_types', {
        params: {
          user: options.user,
          count: options.count,
          page_token: options.pageToken,
          sort: options.sort
        }
      })
    } catch (e) {
      throw this.getCalendlyError(e)
    }

    const entities: EventTypeEntity[] = response.data.collection

    const pagination = this.getPagination(response.data.pagination)
    const collection = entities.map(entity => {
      return this.getEventType(entity)
    })

    return {
      collection,
      pagination
    }
  }

  private getEventType(data: EventTypeEntity): EventType {
    return {
      uri: data.uri,
      name: data.name,
      active: data.active,
      slug: data.slug,
      schedulingUrl: data.scheduling_url,
      duration: data.duration,
      kind: data.kind as Kind,
      poolingType: data.pooling_type as PoolingType,
      type: data.type as EventTypeType,
      color: data.color,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
      internalNote: data.internal_note,
      descriptionPlain: data.description_plain,
      descriptionHtml: data.description_html,
      profile: this.getProfile(data.profile),
      secret: data.secret
    }
  }

  private getProfile(data: ProfileEntity): Profile {
    return {
      type: data.type as ProfileType,
      name: data.name,
      owner: data.owner
    }
  }
}