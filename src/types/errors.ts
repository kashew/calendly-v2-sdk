export type CalendlyErrorEntity = {
  title: string
  message: string
  details: CalendlyErrorDetail[]
}

export type CalendlyErrorDetail = {
  parameter: string
  message:  string
}

export type OAuthErrorEntity = {
  error: string
  error_description: string
}