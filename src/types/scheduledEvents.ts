import { Pagination } from '.'

export enum LocationType {
  InPersonMeeting = 'physical',
  OutboundCall = 'outbound_call',
  InboundCall = 'inbound_call',
  GoogleConference = 'google_conference',
  ZoomConference = 'zoom_conference',
  GoToMeetingConference = 'gotomeeting',
  MicrosoftTeamsConference = 'microsoft_teams_conference',
  Custom = 'custom',
  InviteeSpecified = 'ask_invitee'
}

export enum ConferenceStatus {
  Initiated = 'initiated',
  Processing = 'processing',
  Pushed = 'pushed',
  Failed = 'failed'
}

export enum ScheduledEventStatus {
  Active = 'active',
  Canceled = 'canceled'
}

export type CustomLocation = {
  type: LocationType.Custom
  location: string
}

export type CustomLocationEntity = {
  type: 'custom'
  location: string
}

export type EventMembership = {
  user: string
}

export type GoogleConference = {
  type: LocationType.GoogleConference
  status: ConferenceStatus
  joinUrl: string
}
export type GoogleConferenceEntity = {
  type: 'google_conference'
  status: ConferenceStatus
  join_url: string
}

export type GoToMeetingConference = {
  type: LocationType.GoToMeetingConference
  status: ConferenceStatus
  joinUrl: string
  data: GoToMeetingConferenceData
}

export type GoToMeetingConferenceEntity = {
  type: 'gotomeeting'
  status: string
  join_url: string
  data: GoToMeetingConferenceData
}

export type GoToMeetingConferenceData = {
  uniqueMeetingId?: number
  conferenceCallInfo?: string
}

export type InboundCall = {
  type: LocationType.InboundCall
  location: string
}

export type InboundCallEntity = {
  type: 'inbound_call'
  location: string
}

export type InPersonMeeting = {
  type: LocationType.InPersonMeeting
  location: string
}

export type InPersonMeetingEntity = {
  type: 'physical'
  location: string
}

export type InviteesCounter = {
  total: number
  active: number
  limit: number
}

export type InviteeSpecifiedLocation = {
  type: LocationType.InviteeSpecified
  location: string
}

export type InviteeSpecifiedLocationEntity = {
  type: 'ask_invitee'
  location: string
}

export type MeetingLocation =
  | InPersonMeeting
  | OutboundCall
  | InboundCall
  | GoogleConference
  | ZoomConference
  | GoToMeetingConference
  | MicrosoftTeamsConference
  | CustomLocation
  | InviteeSpecifiedLocation

export type MeetingLocationEntity =
  | InPersonMeetingEntity
  | OutboundCallEntity
  | InboundCallEntity
  | GoogleConferenceEntity
  | ZoomConferenceEntity
  | GoToMeetingConferenceEntity
  | MicrosoftTeamsConferenceEntity
  | CustomLocationEntity
  | InviteeSpecifiedLocationEntity

export type MicrosoftTeamsConference = {
  type: LocationType.MicrosoftTeamsConference
  status: ConferenceStatus
  joinUrl: string
  data: MicrosoftTeamsConferenceData
}

export type MicrosoftTeamsConferenceEntity = {
  type: 'microsoft_teams_conference'
  status: string
  join_url: string
  data: MicrosoftTeamsConferenceData
}

export type MicrosoftTeamsConferenceData = {
  id?: string
  audioConferencing?: {
    conferenceId?: string
    dialinUrl?: string
    tollNumber?: string
  }
}

export type OutboundCall = {
  type: LocationType.OutboundCall
  location: string
}

export type OutboundCallEntity = {
  type: 'outbound_call'
  location: string
}

export type ScheduledEvent = {
  uri: string
  name: string
  status: ScheduledEventStatus
  startTime: string
  endTime: string
  eventType: string
  location: MeetingLocation
  inviteesCounter: InviteesCounter
  createdAt: string
  updatedAt: string
  eventMemberships: EventMembership[]
}

export type ScheduledEventEntity = {
  uri: string
  name: string
  status: string
  start_time: string
  end_time: string
  event_type: string
  location: MeetingLocationEntity
  invitees_counter: InviteesCounter
  created_at: string
  updated_at: string
  event_memberships: EventMembership[]
}

export type ScheduledEventList = {
  collection: ScheduledEvent[]
  pagination: Pagination
}

export type ScheduledEventOptions = {
  organization?: string
  user?: string
  count?: number
  inviteeEmail?: string
  maxStartTime?: Date
  minStartTime?: Date
  pageToken?: string
  sort?: ScheduledEventSort
  status?: ScheduledEventStatus
}

export enum ScheduledEventSort {
  StartTimeAscending = 'start_time:asc',
  StartTimeDescending = 'start_time:desc'
}

export type ZoomConference = {
  type: LocationType.ZoomConference
  status: ConferenceStatus
  joinUrl: string
  data: ZoomConferenceData
}

export type ZoomConferenceEntity = {
  type: 'zoom_conference'
  status: string
  join_url: string
  data: ZoomConferenceDataEntity
}

export type ZoomConferenceData = {
  id?: string
  settings?: {
    globalDialInNumbers?: {
      number?: string
      country?: string
      type?: string
      city?: string
      countryName?: string
    }[]
  },
  extra?: {
    intlNumbersUrl?: string
  },
  password?: string
}

export type ZoomConferenceDataEntity = {
  id?: string
  settings?: {
    global_dial_in_numbers?: {
      number?: string
      country?: string
      type?: string
      city?: string
      country_name?: string
    }[]
  },
  extra?: {
    intl_numbers_url?: string
  },
  password?: string
}