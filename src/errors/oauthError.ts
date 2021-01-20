import { OAuthErrorEntity } from '../types'

export default class OAuthError extends Error {
  public status: number
  public details: OAuthErrorEntity

  constructor(message: string, status: number, details: OAuthErrorEntity) {
    super(message)
    Object.setPrototypeOf(this, OAuthError.prototype)

    this.status = status
    this.details = details
  }
}