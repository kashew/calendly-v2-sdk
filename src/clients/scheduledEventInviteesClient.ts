import { AxiosResponse } from 'axios'
import BaseClient from './baseClient'
import * as dotenv from 'dotenv'
import { Invitee, InviteeEntity, InviteeList, InviteeOptions, InviteeStatus, PaginationEntity, Token } from 'src/types'

export default class ScheduledEventInviteesClient extends BaseClient {
  constructor(token: Token, scheduledEventUuid: string) {
    dotenv.config()
    const baseUrl = process.env.CALENDLY_BASE_URL ?? BaseClient.CALENDLY_BASE_URL

    super(token, `${baseUrl}/scheduled_events/${scheduledEventUuid}`)
  }

  public async get(uuid: string): Promise<Invitee> {
    let response: AxiosResponse<{ resource: InviteeEntity }>

    try {
      response = await this.calendlyApi.get(`/invitees/${uuid}`)
    } catch (e) {
      throw this.getCalendlyError(e)
    }

    return this.getInvitee(response.data.resource)
  }

  public async list(options: InviteeOptions = {}): Promise<InviteeList> {
    let response: AxiosResponse<{ collection: InviteeEntity[], pagination: PaginationEntity }>

    try {
      response = await this.calendlyApi.get('/invitees', {
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

    const entities: InviteeEntity[] = response.data.collection

    const pagination = this.getPagination(response.data.pagination)
    const collection = entities.map(entity => {
      return this.getInvitee(entity)
    })

    return {
      collection,
      pagination
    }
  }

  private getInvitee(data: InviteeEntity): Invitee {
    return {
      uri: data.uri,
      email: data.email,
      name: data.name,
      status: data.status as InviteeStatus,
      questionsAndAnswers: data.questions_and_answers,
      timezone: data.timezone,
      event: data.event,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
      tracking: {
        utmCampaign: data.tracking.utm_campaign,
        utmSource: data.tracking.utm_source,
        utmMedium: data.tracking.utm_medium,
        utmContent: data.tracking.utm_content,
        utmTerm: data.tracking.utm_term,
        salesforceUuid: data.tracking.salesforce_uuid
      },
      textReminderNumber: data.text_reminder_number,
      rescheduled: data.rescheduled,
      oldInvitee: data.old_invitee,
      newInvitee: data.new_invitee,
      cancelUrl: data.cancel_url,
      rescheduleUrl: data.reschedule_url
    }
  }
}