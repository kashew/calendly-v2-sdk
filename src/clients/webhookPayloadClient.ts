import crypto from 'crypto'
import { WebhookPayloadEntity } from '../types'

/**
 * Client used for verifying Webhook Payload resource data
 */
export default class WebhookPayloadClient {
  private webhookSigningKey: string
  private tolerance: number

  /**
   * Create a client instance for verifying a Webhook Payload
   * @param webhookSigningKey - Webhook Signing Key used to validate a webhook signature
   * @param tolerance - Number of seconds that will be tolerated since the creation of the webhook payload
   */
  constructor(webhookSigningKey: string, tolerance: number) {
    this.webhookSigningKey = webhookSigningKey
    this.tolerance = tolerance
  }

  /**
   * Verify Webhook Payload
   * @param webhookSignature - Webhook Signature from the Calendly-Webhook-Signature header
   * @param message - Webhook Payload
   */
  public async verify(webhookSignature: String, message: WebhookPayloadEntity): Promise<void> {
    const [t, v1] = webhookSignature.split(',')
    let tolerance: number
    let signature: string

    try {
      tolerance = Number(t.split('=')[1])
      signature = v1.split('=')[1]
    } catch (e) {
      throw new Error('Invalid Format')
    }

    const data = tolerance + '.' + JSON.stringify(message)
    const expectedSignature = crypto.createHmac('sha256', this.webhookSigningKey).update(data, 'utf8').digest('hex')

    if (expectedSignature !== signature) {
      throw new Error('Invalid Signature');
    }

    if (tolerance < (Math.floor(Date.now() / 1000) - this.tolerance)) {
      throw new Error('Invalid Tolerance');
    }
  }
}