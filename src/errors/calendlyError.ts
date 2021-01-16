import { CalendlyErrorDetail } from "../types"

export default class CalendlyError extends Error {
  public title: string
  public details: CalendlyErrorDetail[]
  public status: number

  constructor(title: string, message: string, details: CalendlyErrorDetail[], status: number) {
    super(message)
    Object.setPrototypeOf(this, CalendlyError.prototype)

    this.title = title
    this.details = details
    this.status = status
  }
}