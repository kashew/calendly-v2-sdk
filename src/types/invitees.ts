import { Pagination } from '.'

export type Invitee = {
  uri: string
  email: string
  name: string
  status: InviteeStatus
  questionsAndAnswers: QuestionAndAnswer[]
  timezone: string
  event: string
  createdAt: Date
  updatedAt: Date
  tracking: {
    utmCampaign: string
    utmSource: string
    utmMedium: string
    utmContent: string
    utmTerm: string
    salesforceUuid: string
  }
  textReminderNumber: string
  rescheduled: boolean
  oldInvitee: string
  newInvitee: string
  cancelUrl: string
  rescheduleUrl: string
}

export type InviteeEntity = {
  uri: string
  email: string
  name: string
  status: string
  questions_and_answers: QuestionAndAnswer[]
  timezone: string
  event: string
  created_at: string
  updated_at: string
  tracking: {
    utm_campaign: string
    utm_source: string
    utm_medium: string
    utm_content: string
    utm_term: string
    salesforce_uuid: string
  }
  text_reminder_number: string
  rescheduled: boolean
  old_invitee: string
  new_invitee: string
  cancel_url: string
  reschedule_url: string
}

export type InviteeList = {
  collection: Invitee[]
  pagination: Pagination
}

export type InviteeOptions = {
  count?: number
  email?: string
  pageToken?: string
  sort?: InviteeSort
  status?: InviteeStatus
}

export enum InviteeSort {
  CreatedAtAscending = 'created_at:asc',
  CreatedAtDescending = 'created_at:desc'
}

export enum InviteeStatus {
  Active = 'active',
  Canceled = 'canceled'
}

export type QuestionAndAnswer = {
  question: string
  answer: string
  position: number
}