import * as dotenv from 'dotenv'
import { OrganizationMembership, OrganizationMembershipEntity, OrganizationRole, Token } from 'src/types'
import { AxiosResponse } from 'axios'
import BaseClient from './baseClient'
import { UsersClient } from '.'

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