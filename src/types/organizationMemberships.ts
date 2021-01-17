import { Pagination, User, UserEntity } from '.'

export type OrganizationMembership = {
  uri: string
  role: OrganizationRole
  user: User
  organization: string
  updatedAt: Date
  createdAt: Date
}

export type OrganizationMembershipEntity = {
  uri: string
  role: string
  user: UserEntity
  organization: string
  updated_at: string
  created_at: string
}

export type OrganizationMembershipList = {
  collection: OrganizationMembership[]
  pagination: Pagination
}

export type OrganizationMembershipOptions = {
  organization?: string
  user?: string,
  count?: number,
  email?: string,
  pageToken?: string
}

export enum OrganizationRole {
  Admin = 'admin',
  Owner = 'owner',
  User = 'user'
}