import * as dotenv from 'dotenv'
import {
  IntrospectResponse, IntrospectResponseEntity, OAuthErrorEntity,
  Token, TokenEntity, TokenOptions
} from '../types'
import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios'
import OAuthError from '../errors/oauthError'

export default class OAuthClient {
  private oauthApi: AxiosInstance
  private clientId: string
  private clientSecret: string

  private static readonly CALENDLY_OAUTH_BASE_URL: string = 'https://auth.calendly.com'

  public constructor(clientId: string, clientSecret?: string) {
    dotenv.config()

    this.clientId = clientId
    this.clientSecret = clientSecret
    this.oauthApi = axios.create({
      baseURL: process.env.CALENDLY_OAUTH_BASE_URL ?? OAuthClient.CALENDLY_OAUTH_BASE_URL
    })
  }

  public async token(options: TokenOptions) : Promise<Token> {
    let response: AxiosResponse<TokenEntity>

    try {
      response = await this.oauthApi.post('/oauth/token', {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        code: options.code,
        grant_type: options.grantType,
        redirect_uri: options.redirectUri,
        refresh_token: options.refreshToken
      })
    } catch (e) {
      throw this.getCalendlyError(e)
    }

    return this.getToken(response.data)
  }

  public async introspect(token: string): Promise<IntrospectResponse> {
    let response: AxiosResponse<IntrospectResponseEntity>

    try {
      response = await this.oauthApi.post('/oauth/introspect', {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        token
      })
    } catch (e) {
      throw this.getCalendlyError(e)
    }

    return this.getIntrospectResponse(response.data)
  }

  public async revoke(token: string): Promise<void> {
    try {
      await this.oauthApi.post('/oauth/revoke', {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        token
      })
    } catch (e) {
      throw this.getCalendlyError(e)
    }
  }

  private getToken(entity: TokenEntity): Token {
    return {
      accessToken: entity.access_token,
      createdAt: new Date(entity.created_at * 1000),
      expiresIn: entity.expires_in,
      organization: entity.organization,
      owner: entity.owner,
      refreshToken: entity.refresh_token,
      scope: entity.scope,
      tokenType: entity.token_type
    }
  }

  private getIntrospectResponse(entity: IntrospectResponseEntity): IntrospectResponse {
    return {
      active: entity.active,
      clientId: entity.client_id,
      expiresAt: new Date(entity.exp * 1000),
      issuedAt: new Date(entity.iat * 1000),
      organization: entity.organization,
      owner: entity.owner,
      scope: entity.scope,
      tokenType: entity.token_type
    }
  }

  private getCalendlyError(e: AxiosError<OAuthErrorEntity>): OAuthError {
    return new OAuthError(
      e.message,
      e.response.status,
      e.response.data)
  }
}