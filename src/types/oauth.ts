export enum GrantType {
  AuthorizationCode = 'authorization_code',
  RefreshToken = 'refresh_token'
}

export type TokenEntity = {
  token_type: string,
  access_token: string
  refresh_token: string
  scope?: string
  created_at: number
  expires_in: number
  owner: string
  organization: string
}

export type TokenOptions = {
  code?: string
  grantType: GrantType
  redirectUri?: string
  refreshToken?: string
}

export type Token = {
  accessToken: string,
  createdAt: Date,
  expiresIn: number,
  organization: string,
  owner: string,
  refreshToken: string,
  scope: string,
  tokenType: string
}

export type IntrospectResponse = {
  active: boolean
  clientId: string
  expiresAt: Date
  issuedAt: Date
  organization: string
  owner: string
  scope: string
  tokenType: string
}

export type IntrospectResponseEntity = {
  active: boolean
  client_id: string
  exp: number
  iat: number
  organization: string
  owner: string
  scope: string
  token_type: string
}