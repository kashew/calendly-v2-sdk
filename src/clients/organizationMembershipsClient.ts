import * as dotenv from 'dotenv'
import {
  OrganizationMembership, OrganizationMembershipEntity, OrganizationMembershipList,
  OrganizationMembershipOptions, OrganizationRole, PaginationEntity, Token } from '../types'
import { AxiosResponse } from 'axios'
import BaseClient from './baseClient'
import UsersClient from './usersClient'

export default class OrganizationMembershipsClient extends BaseClient {
  constructor(token: Token) {
    dotenv.config()
    const baseUrl = process.env.CALENDLY_BASE_URL ?? BaseClient.CALENDLY_BASE_URL

    super(token, baseUrl)
  }

  public async get(uuid: string): Promise<OrganizationMembership> {
    let response: AxiosResponse<{ resource: OrganizationMembershipEntity }>

    try {
      response = await this.calendlyApi.get(`/organization_memberships/${uuid}`)
    } catch (e) {
      throw this.getCalendlyError(e)
    }

    return this.getOrganizationMembership(response.data.resource)
  }

  public async list(options: OrganizationMembershipOptions): Promise<OrganizationMembershipList> {
    let response: AxiosResponse<{ collection: OrganizationMembershipEntity[], pagination: PaginationEntity }>

    try {
      response = await this.calendlyApi.get('/organization_memberships', {
        params: {
          organization: options.organization,
          user: options.user,
          count: options.count,
          email: options.email,
          page_token: options.pageToken
        }
      })
    } catch (e) {
      throw this.getCalendlyError(e)
    }

    const entities: OrganizationMembershipEntity[] = response.data.collection

    const pagination = this.getPagination(response.data.pagination)
    const collection = entities.map(entity => {
      return this.getOrganizationMembership(entity)
    })

    return {
      collection,
      pagination
    }
  }

  public async delete(uuid: string): Promise<void> {
    try {
      await this.calendlyApi.delete(`/organization_memberships/${uuid}`)
    } catch (e) {
      throw this.getCalendlyError(e)
    }
  }

  private getOrganizationMembership(entity: OrganizationMembershipEntity): OrganizationMembership {
    return {
      uri: entity.uri,
      role: entity.role as OrganizationRole,
      user: UsersClient.getUser(entity.user),
      organization: entity.organization,
      updatedAt: new Date(entity.updated_at),
      createdAt: new Date(entity.created_at)
    }
  }
}