import * as dotenv from 'dotenv'
import {
  ConferenceStatus, CustomLocation, CustomLocationEntity, GoToMeetingConference, GoToMeetingConferenceEntity,
  GoogleConference, GoogleConferenceEntity, InPersonMeeting, InPersonMeetingEntity,
  InboundCall, InboundCallEntity, InviteeSpecifiedLocation, InviteeSpecifiedLocationEntity, LocationType,
  MeetingLocation, MeetingLocationEntity, MicrosoftTeamsConference, MicrosoftTeamsConferenceEntity,
  OutboundCall, OutboundCallEntity, PaginationEntity, ScheduledEvent,
  ScheduledEventEntity, ScheduledEventList, ScheduledEventOptions, ScheduledEventStatus,
  Token, ZoomConference, ZoomConferenceEntity } from 'src/types'
import { AxiosResponse } from 'axios'
import BaseClient from './baseClient'

export default class ScheduledEventsClient extends BaseClient {
  constructor(token: Token) {
    dotenv.config()
    const baseUrl = process.env.CALENDLY_BASE_URL ?? BaseClient.CALENDLY_BASE_URL

    super(token, baseUrl)
  }

  public async get(uuid: string): Promise<ScheduledEvent> {
    let response: AxiosResponse<{ resource: ScheduledEventEntity }>

    try {
      response = await this.calendlyApi.get(`/scheduled_events/${uuid}`)
    } catch (e) {
      throw this.getCalendlyError(e)
    }

    return this.getScheduledEvent(response.data.resource)
  }

  public async list(options: ScheduledEventOptions): Promise<ScheduledEventList> {
    let response: AxiosResponse<{ collection: ScheduledEventEntity[], pagination: PaginationEntity }>

    try {
      response = await this.calendlyApi.get('/scheduled_events', {
        params: {
          organization: options.organization,
          user: options.user,
          count: options.count,
          invitee_email: options.inviteeEmail,
          max_start_time: options.maxStartTime?.toJSON(),
          min_start_time: options.minStartTime?.toJSON(),
          page_token: options.pageToken,
          sort: options.sort,
          status: options.status
        }
      })
    } catch (e) {
      throw this.getCalendlyError(e)
    }

    const entities: ScheduledEventEntity[] = response.data.collection

    const pagination = this.getPagination(response.data.pagination)
    const collection = entities.map(entity => {
      return this.getScheduledEvent(entity)
    })

    return {
      collection,
      pagination
    }
  }

  private getScheduledEvent(entity: ScheduledEventEntity): ScheduledEvent {
    return {
      uri: entity.uri,
      name: entity.name,
      status: entity.status as ScheduledEventStatus,
      startTime: new Date(entity.start_time),
      endTime: new Date(entity.end_time),
      eventType: entity.event_type,
      location: this.getLocation(entity.location),
      inviteesCounter: {
        active: entity.invitees_counter.active,
        limit: entity.invitees_counter.limit,
        total: entity.invitees_counter.total
      },
      createdAt: new Date(entity.created_at),
      updatedAt: new Date(entity.updated_at),
      eventMemberships: entity.event_memberships
    }
  }

  private getLocation(entity: MeetingLocationEntity): MeetingLocation {
    switch(entity.type as LocationType) {
      case LocationType.Custom:
        return this.getCustomLocation(entity as CustomLocationEntity)
      case LocationType.GoToMeetingConference:
        return this.getGoToMeetingLocation(entity as GoToMeetingConferenceEntity)
      case LocationType.GoogleConference:
        return this.getGoogleLocation(entity as GoogleConferenceEntity)
      case LocationType.InPersonMeeting:
        return this.getInPersonLocation(entity as InPersonMeetingEntity)
      case LocationType.InboundCall:
        return this.getInboundCallLocation(entity as InboundCallEntity)
      case LocationType.InviteeSpecified:
        return this.getInviteeSpecifiedLocation(entity as InviteeSpecifiedLocationEntity)
      case LocationType.MicrosoftTeamsConference:
        return this.getMicrosoftTeamsLocation(entity as MicrosoftTeamsConferenceEntity)
      case LocationType.OutboundCall:
        return this.getOutboundCallLocation(entity as OutboundCallEntity)
      case LocationType.ZoomConference:
        return this.getZoomLocation(entity as ZoomConferenceEntity)
    }
  }

  private getCustomLocation(entity: CustomLocationEntity): CustomLocation {
    return {
      type: LocationType.Custom,
      location: entity.location
    }
  }

  private getGoToMeetingLocation(entity: GoToMeetingConferenceEntity): GoToMeetingConference {
    return {
      type: LocationType.GoToMeetingConference,
      status: entity.status as ConferenceStatus,
      joinUrl: entity.join_url,
      data: entity.data
    }
  }

  private getGoogleLocation(entity: GoogleConferenceEntity): GoogleConference {
    return {
      type: LocationType.GoogleConference,
      status: entity.status,
      joinUrl: entity.join_url
    }
  }

  private getInPersonLocation(entity: InPersonMeetingEntity): InPersonMeeting {
    return {
      type: LocationType.InPersonMeeting,
      location: entity.location
    }
  }

  private getInboundCallLocation(entity: InboundCallEntity): InboundCall {
    return {
      type: LocationType.InboundCall,
      location: entity.location
    }
  }

  private getInviteeSpecifiedLocation(entity: InviteeSpecifiedLocationEntity): InviteeSpecifiedLocation {
    return {
      type: LocationType.InviteeSpecified,
      location: entity.location
    }
  }

  private getMicrosoftTeamsLocation(entity: MicrosoftTeamsConferenceEntity): MicrosoftTeamsConference {
    return {
      type: LocationType.MicrosoftTeamsConference,
      status: entity.status as ConferenceStatus,
      joinUrl: entity.join_url,
      data: entity.data
    }
  }

  private getOutboundCallLocation(entity: OutboundCallEntity): OutboundCall {
    return {
      type: LocationType.OutboundCall,
      location: entity.location
    }
  }

  private getZoomLocation(entity: ZoomConferenceEntity): ZoomConference {
    return {
      type: LocationType.ZoomConference,
      status: entity.status as ConferenceStatus,
      joinUrl: entity.join_url,
      data: {
        id: entity.data.id,
        settings: {
          globalDialInNumbers: entity.data.settings.global_dial_in_numbers.map(record => {
            return {
              number: record.number,
              country: record.country,
              type: record.type,
              city: record.city,
              countryName: record.country_name
            }
          })
        },
        extra: {
          intlNumbersUrl: entity.data.extra.intl_numbers_url
        },
        password: entity.data.password
      }
    }
  }
}