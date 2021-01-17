import { Pagination } from '.'

export type OrganizationInvitation = {
  uri: string
  organization: string
  email: string
  status: OrganizationInvitationStatus
  createdAt: Date
  updatedAt: Date
  lastSentAt: Date
  user: string
}

export type OrganizationInvitationCreateOptions = {
  email: string
}

export type OrganizationInvitationEntity = {
  uri: string
  organization: string
  email: string
  status: string
  created_at: string
  updated_at: string
  last_sent_at: string
  user: string
}

export type OrganizationInvitationList = {
  collection: OrganizationInvitation[]
  pagination: Pagination
}

export type OrganizationInvitationOptions = {
  count?: number
  email?: string
  pageToken?: string
  sort?: OrganizationInvitationSort
  status?: OrganizationInvitationStatus
}

export enum OrganizationInvitationSort {
  CreatedAtAscending = 'created_at:asc',
  CreatedAtDescending = 'created_at:desc'
}

export enum OrganizationInvitationStatus {
  Accepted = 'accepted',
  Declined = 'declined',
  Pending = 'pending'
}