export enum SchedulingLinkOwnerType {
  EventType = 'EventType'
}

export type SchedulingLink = {
  bookingUrl: string
  owner: string
  ownerType: SchedulingLinkOwnerType
}

export type SchedulingLinkEntity = {
  booking_url: string
  owner: string
  owner_type: 'EventType'
}

export type SchedulingLinkCreateOptions = {
  maxEventCount: 1,
  owner: string,
  ownerType: SchedulingLinkOwnerType
}