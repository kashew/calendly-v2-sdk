import { AxiosResponse } from 'axios'
import BaseClient from './baseClient'
import * as dotenv from 'dotenv'
import { Token, User, UserEntity } from 'src/types'

export default class UsersClient extends BaseClient {
  constructor(token: Token) {
    dotenv.config()
    const baseUrl = process.env.CALENDLY_BASE_URL ?? BaseClient.CALENDLY_BASE_URL

    super(token, baseUrl)
  }
  
  public async get(uuid: string): Promise<User> {
    let response: AxiosResponse<{ resource: UserEntity }>

    try {
      response = await this.calendlyApi.get(`/users/${uuid}`)
    } catch (e) {
      throw this.getCalendlyError(e)
    }

    return this.getUser(response.data.resource)
  }

  public async me(): Promise<User> {
    let response: AxiosResponse<{ resource: UserEntity }>

    try {
      response = await this.calendlyApi.get('/users/me')
    } catch (e) {
      throw this.getCalendlyError(e)
    }

    return this.getUser(response.data.resource)
  }

  private getUser(data: UserEntity): User {
    return {
      avatarUrl: data.avatar_url,
      createdAt: data.created_at,
      email: data.email,
      name: data.name,
      schedulingUrl: data.scheduling_url,
      slug: data.slug,
      timezone: data.timezone,
      updatedAt: data.updated_at,
      uri: data.uri
    }
  }
}