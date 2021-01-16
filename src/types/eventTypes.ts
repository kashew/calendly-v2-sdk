import { Pagination } from '.'

export type ProfileEntity = {
  type: string
  name: string
  owner: string
}

export type Profile = {
  type: ProfileType
  name: string
  owner: string
}

export enum Kind {
  Solo = 'solo',
  Group = 'group'
}

export enum PoolingType {
  RoundRobin = 'round robin',
  Collective = 'collective'
}

export enum EventTypeType {
  AdhocEventType = 'AdhocEventType',
  StandardEventType = 'StandardEventType'
}

export enum ProfileType {
  User = 'user',
  Team = 'team'
}

export enum EventTypeSort {
  NameAscending = 'name:asc',
  NameDescending = 'name:desc'
}

export type EventTypeEntity = {
  uri: string
  name: string
  active: boolean
  slug: string
  scheduling_url: string
  duration: number
  kind: string
  pooling_type: string
  type: string
  color: string
  created_at: string
  updated_at: string
  internal_note: string
  description_plain: string
  description_html: string
  profile: ProfileEntity
  secret: boolean
}

export type EventTypeList = {
  collection: EventType[]
  pagination: Pagination
}

export type EventType = {
  uri: string
  name: string
  active: boolean
  slug: string
  schedulingUrl: string
  duration: number
  kind: Kind
  poolingType: PoolingType
  type: EventTypeType
  color: string
  createdAt: string
  updatedAt: string
  internalNote: string
  descriptionPlain: string
  descriptionHtml: string
  profile: Profile
  secret: boolean
}

export type EventTypeOptions = {
  user: string,
  count?: number,
  pageToken?: string,
  sort?: EventTypeSort
}