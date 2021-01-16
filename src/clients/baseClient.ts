import axios, { AxiosError, AxiosInstance } from "axios"
import CalendlyError from "../errors/calendlyError"
import { CalendlyErrorEntity, Pagination, PaginationEntity, Token } from "../types"

export default abstract class BaseClient {
  protected token: Token
  protected calendlyApi: AxiosInstance
  protected static readonly CALENDLY_BASE_URL: string = 'https://api.calendly.com'

  protected constructor(token: Token, baseUrl: string) {
    this.token = token
    this.calendlyApi = axios.create({
      baseURL: baseUrl,
      headers: {
        'Authorization': `${this.token.tokenType} ${this.token.accessToken}`
      }
    })
  }

  protected getCalendlyError(e: AxiosError<CalendlyErrorEntity>): CalendlyError {
    return new CalendlyError(
      e.response.data.title,
      e.response.data.message,
      e.response.data.details,
      e.response.status)
  }

  protected getPagination(data: PaginationEntity): Pagination {
    return {
      count: data.count,
      nextPage: data.next_page
    }
  }
}