import faker from 'faker'
import crypto from 'crypto'
import { WebhookPayloadClient } from '@'
import { WebhookPayloadFactory } from '../factories'

const signingKey = faker.random.uuid()
const tolerance = faker.random.number({ min: 1, max: 300 })
const client = new WebhookPayloadClient(signingKey, tolerance)

describe('.verify', () => {
  const body = WebhookPayloadFactory.createEntity()

  beforeAll(() => {
    jest.spyOn(Date, 'now').mockReturnValue(Date.now())
  })

  describe('when signature is within tolerance', () => {
    const validTolerance = Math.floor(Date.now() / 1000) - tolerance

    describe('when signature is valid', () => {
      const data = validTolerance + '.' + JSON.stringify(body)
      const signature = crypto.createHmac('sha256', signingKey).update(data, 'utf8').digest('hex')
      const webhookSignature = `t=${validTolerance},v1=${signature}`

      it('returns a promise that resolves', async () => {
        const result = client.verify(webhookSignature, body)

        await expect(result).resolves.toBeUndefined()
      })
    })

    describe('when signature is invalid', () => {
      const data = validTolerance + '.' + JSON.stringify(body)
      const signature = crypto.createHmac('sha256', signingKey).update(data, 'utf8').digest('hex')
      const webhookSignature = `t=${validTolerance},v1=${signature}`

      it('rejects with message', async () => {
        let result: Error
        const invalidBody = WebhookPayloadFactory.createEntity()

        try {
          await client.verify(webhookSignature, invalidBody)
        } catch (e) {
          result = e
        }

        expect(result.message).toEqual('Invalid Signature')
      })
    })
  })

  describe('when signature is not within tolerance', () => {
    const invalidTolerance = Math.floor(Date.now() / 1000) - tolerance - 1

    describe('when signature is valid', () => {
      const data = invalidTolerance + '.' + JSON.stringify(body)
      const signature = crypto.createHmac('sha256', signingKey).update(data, 'utf8').digest('hex')
      const webhookSignature = `t=${invalidTolerance},v1=${signature}`

      it('rejects with message', async () => {
        let result: Error

        try {
          await client.verify(webhookSignature, body)
        } catch (e) {
          result = e
        }

        expect(result.message).toEqual('Invalid Tolerance')
      })
    })
  })

  describe('when signature is not correctly formatted', () => {
    const webhookSignature = faker.random.uuid()

    it('rejects with message', async () => {
      let result: Error

      try {
        await client.verify(webhookSignature, body)
      } catch (e) {
        result = e
      }

      expect(result.message).toEqual('Invalid Format')
    })
  })
})