import * as dotenv from 'dotenv'
import {
  OrganizationInvitation, OrganizationInvitationCreateOptions, OrganizationInvitationEntity,
  OrganizationInvitationList, OrganizationInvitationOptions, OrganizationInvitationStatus,
  PaginationEntity, Token } from '../types'
import { AxiosResponse } from 'axios'
import BaseClient from './baseClient'

export default class OrganizationInvitationsClient extends BaseClient {
  constructor(token: Token, organizationUuid: string) {
    dotenv.config()
    const baseUrl = process.env.CALENDLY_BASE_URL ?? BaseClient.CALENDLY_BASE_URL

    super(token, `${baseUrl}/organizations/${organizationUuid}`)
  }

  public async create(options: OrganizationInvitationCreateOptions): Promise<OrganizationInvitation> {
    let response: AxiosResponse<{ resource: OrganizationInvitationEntity }>

    try {
      response = await this.calendlyApi.post('/invitations', {
        email: options.email
      })
    } catch (e) {
      throw this.getCalendlyError(e)
    }

    return this.getOrganizationInvitation(response.data.resource)
  }

  public async delete(uuid: string): Promise<void> {
    try {
      await this.calendlyApi.delete(`/invitations/${uuid}`)
    } catch (e) {
      throw this.getCalendlyError(e)
    }
  }

  public async get(uuid: string): Promise<OrganizationInvitation> {
    let response: AxiosResponse<{ resource: OrganizationInvitationEntity }>

    try {
      response = await this.calendlyApi.get(`/invitations/${uuid}`)
    } catch (e) {
      throw this.getCalendlyError(e)
    }

    return this.getOrganizationInvitation(response.data.resource)
  }

  public async list(options: OrganizationInvitationOptions = {}): Promise<OrganizationInvitationList> {
    let response: AxiosResponse<{ collection: OrganizationInvitationEntity[], pagination: PaginationEntity }>

    try {
      response = await this.calendlyApi.get('/invitations', {
        params: {
          count: options.count,
          email: options.email,
          page_token: options.pageToken,
          sort: options.sort,
          status: options.status
        }
      })
    } catch (e) {
      throw this.getCalendlyError(e)
    }

    const entities: OrganizationInvitationEntity[] = response.data.collection

    const pagination = this.getPagination(response.data.pagination)
    const collection = entities.map(entity => {
      return this.getOrganizationInvitation(entity)
    })

    return {
      collection,
      pagination
    }
  }

  private getOrganizationInvitation(entity: OrganizationInvitationEntity): OrganizationInvitation {
    const lastSentAt = (entity.last_sent_at) ? new Date(entity.last_sent_at) : null

    return {
      uri: entity.uri,
      organization: entity.organization,
      email: entity.email,
      status: entity.status as OrganizationInvitationStatus,
      createdAt: new Date(entity.created_at),
      updatedAt: new Date(entity.updated_at),
      lastSentAt: lastSentAt,
      user: entity.user
    }
  }
}