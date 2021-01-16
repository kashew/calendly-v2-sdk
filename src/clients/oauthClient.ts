import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios'
import OAuthError from '../errors/oauthError'
import * as dotenv from 'dotenv'
import { TokenOptions, Token, IntrospectResponse, TokenParams, IntrospectParams, RevokeParams, TokenEntity, OAuthErrorEntity, IntrospectResponseEntity } from '../types'

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
      response = await this.oauthApi.post('/oauth/token',
        this.getTokenParams(options))
    } catch (e) {
      throw this.getCalendlyError(e)
    }

    return {
      accessToken: response.data.access_token,
      createdAt: response.data.created_at,
      expiresIn: response.data.expires_in,
      organization: response.data.organization,
      owner: response.data.owner,
      refreshToken: response.data.refresh_token,
      scope: response.data.scope,
      tokenType: response.data.token_type
    }
  }

  public async introspect(token: string): Promise<IntrospectResponse> {
    let response: AxiosResponse<IntrospectResponseEntity>

    try {
      response = await this.oauthApi.post('/oauth/introspect',
        this.getIntrospectParams(token))
    } catch (e) {
      throw this.getCalendlyError(e)
    }

    return {
      active: response.data.active,
      clientId: response.data.client_id,
      exp: response.data.exp,
      iat: response.data.iat,
      organization: response.data.organization,
      owner: response.data.owner,
      scope: response.data.scope,
      tokenType: response.data.token_type
    }
  }

  public async revoke(token: string): Promise<void> {
    try {
      await this.oauthApi.post('/oauth/revoke',
        this.getRevokeParams(token))
    } catch (e) {
      throw this.getCalendlyError(e)
    }
  }

  private getTokenParams(options: TokenOptions): TokenParams {
    return {
      client_id: this.clientId,
      client_secret: this.clientSecret,
      code: options.code,
      grant_type: options.grantType,
      redirect_uri: options.redirectUri,
      refresh_token: options.refreshToken
    }
  }

  private getIntrospectParams(token: string): IntrospectParams {
    return {
      client_id: this.clientId,
      client_secret: this.clientSecret,
      token
    }
  }

  private getRevokeParams(token: string): RevokeParams {
    return {
      client_id: this.clientId,
      client_secret: this.clientSecret,
      token
    }
  }

  private getCalendlyError(e: AxiosError<OAuthErrorEntity>): OAuthError {
    return new OAuthError(
      e.message,
      e.response.status,
      e.response.data)
  }
}