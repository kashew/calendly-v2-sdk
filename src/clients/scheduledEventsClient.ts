import { AxiosResponse } from 'axios';
import BaseClient from './baseClient';
import * as dotenv from 'dotenv'
import { ConferenceStatus, CustomLocation, CustomLocationEntity, GoogleConference, GoogleConferenceEntity, GoToMeetingConference, GoToMeetingConferenceEntity, MeetingLocation, MeetingLocationEntity, LocationType, ScheduledEvent, ScheduledEventEntity, ScheduledEventStatus, InPersonMeeting, InPersonMeetingEntity, InboundCall, InboundCallEntity, InviteeSpecifiedLocationEntity, InviteeSpecifiedLocation, MicrosoftTeamsConference, MicrosoftTeamsConferenceEntity, OutboundCall, OutboundCallEntity, ZoomConference, ZoomConferenceEntity, ScheduledEventList, ScheduledEventOptions, PaginationEntity, Token } from '../types'

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

  private getScheduledEvent(data: ScheduledEventEntity): ScheduledEvent {
    return {
      uri: data.uri,
      name: data.name,
      status: data.status as ScheduledEventStatus,
      startTime: data.start_time,
      endTime: data.end_time,
      eventType: data.event_type,
      location: this.getLocation(data.location),
      inviteesCounter: {
        active: data.invitees_counter.active,
        limit: data.invitees_counter.limit,
        total: data.invitees_counter.total
      },
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      eventMemberships: data.event_memberships
    }
  }

  private getLocation(data: MeetingLocationEntity): MeetingLocation {
    switch(data.type as LocationType) {
      case LocationType.Custom:
        return this.getCustomLocation(data as CustomLocationEntity)
      case LocationType.GoToMeetingConference:
        return this.getGoToMeetingLocation(data as GoToMeetingConferenceEntity)
      case LocationType.GoogleConference:
        return this.getGoogleLocation(data as GoogleConferenceEntity)
      case LocationType.InPersonMeeting:
        return this.getInPersonLocation(data as InPersonMeetingEntity)
      case LocationType.InboundCall:
        return this.getInboundCallLocation(data as InboundCallEntity)
      case LocationType.InviteeSpecified:
        return this.getInviteeSpecifiedLocation(data as InviteeSpecifiedLocationEntity)
      case LocationType.MicrosoftTeamsConference:
        return this.getMicrosoftTeamsLocation(data as MicrosoftTeamsConferenceEntity)
      case LocationType.OutboundCall:
        return this.getOutboundCallLocation(data as OutboundCallEntity)
      case LocationType.ZoomConference:
        return this.getZoomLocation(data as ZoomConferenceEntity)
    }
  }

  private getCustomLocation(data: CustomLocationEntity): CustomLocation {
    return {
      type: LocationType.Custom,
      location: data.location
    }
  }

  private getGoToMeetingLocation(data: GoToMeetingConferenceEntity): GoToMeetingConference {
    return {
      type: LocationType.GoToMeetingConference,
      status: data.status as ConferenceStatus,
      joinUrl: data.join_url,
      data: data.data
    }
  }

  private getGoogleLocation(data: GoogleConferenceEntity): GoogleConference {
    return {
      type: LocationType.GoogleConference,
      status: data.status,
      joinUrl: data.join_url
    }
  }

  private getInPersonLocation(data: InPersonMeetingEntity): InPersonMeeting {
    return {
      type: LocationType.InPersonMeeting,
      location: data.location
    }
  }

  private getInboundCallLocation(data: InboundCallEntity): InboundCall {
    return {
      type: LocationType.InboundCall,
      location: data.location
    }
  }

  private getInviteeSpecifiedLocation(data: InviteeSpecifiedLocationEntity): InviteeSpecifiedLocation {
    return {
      type: LocationType.InviteeSpecified,
      location: data.location
    }
  }

  private getMicrosoftTeamsLocation(data: MicrosoftTeamsConferenceEntity): MicrosoftTeamsConference {
    return {
      type: LocationType.MicrosoftTeamsConference,
      status: data.status as ConferenceStatus,
      joinUrl: data.join_url,
      data: data.data
    }
  }

  private getOutboundCallLocation(data: OutboundCallEntity): OutboundCall {
    return {
      type: LocationType.OutboundCall,
      location: data.location
    }
  }

  private getZoomLocation(data: ZoomConferenceEntity): ZoomConference {
    return {
      type: LocationType.ZoomConference,
      status: data.status as ConferenceStatus,
      joinUrl: data.join_url,
      data: {
        id: data.data.id,
        settings: {
          globalDialInNumbers: data.data.settings.global_dial_in_numbers.map(record => {
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
          intlNumbersUrl: data.data.extra.intl_numbers_url
        },
        password: data.data.password
      }
    }
  }
}