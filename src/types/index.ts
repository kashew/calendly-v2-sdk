export {
  CalendlyErrorDetail,
  CalendlyErrorEntity,
  OAuthErrorEntity
} from './errors'

export {
  EventType,
  EventTypeEntity,
  EventTypeList,
  EventTypeOptions,
  EventTypeSort,
  EventTypeType,
  Kind,
  PoolingType,
  Profile,
  ProfileEntity,
  ProfileType
} from './eventTypes'

export {
  Invitee,
  InviteeEntity,
  InviteeList,
  InviteeOptions,
  InviteeSort,
  InviteeStatus
} from './invitees'

export {
  GrantType,
  IntrospectParams,
  IntrospectResponse,
  IntrospectResponseEntity,
  RevokeParams,
  Token,
  TokenEntity,
  TokenOptions,
  TokenParams,
} from './oauth'

export {
  ConferenceStatus,
  CustomLocation,
  CustomLocationEntity,
  EventMembership,
  GoogleConference,
  GoogleConferenceEntity,
  GoToMeetingConference,
  GoToMeetingConferenceData,
  GoToMeetingConferenceEntity,
  InboundCall,
  InboundCallEntity,
  InPersonMeeting,
  InPersonMeetingEntity,
  InviteesCounter,
  InviteeSpecifiedLocation,
  InviteeSpecifiedLocationEntity,
  LocationType,
  MeetingLocation,
  MeetingLocationEntity,
  MicrosoftTeamsConference,
  MicrosoftTeamsConferenceData,
  MicrosoftTeamsConferenceEntity,
  OutboundCall,
  OutboundCallEntity,
  ScheduledEvent,
  ScheduledEventEntity,
  ScheduledEventList,
  ScheduledEventOptions,
  ScheduledEventSort,
  ScheduledEventStatus,
  ZoomConference,
  ZoomConferenceDataEntity,
  ZoomConferenceEntity
} from './scheduledEvents'

export {
  SchedulingLink,
  SchedulingLinkCreateOptions,
  SchedulingLinkEntity,
  SchedulingLinkOwnerType
} from './schedulingLinks'

export {
  OrganizationMembership,
  OrganizationMembershipEntity,
  OrganizationRole
} from './organizationMemberships'

export {
  UserEntity,
  User
} from './users'

export type PaginationEntity = {
  count: number,
  next_page: string
}

export type Pagination = {
  count: number,
  nextPage: string
}