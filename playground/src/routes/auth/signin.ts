import { os } from '@orpc/server'
import { CredentialSchema, TokenSchema } from '../../schemas/auth'

export const signin = os
  .route({
    method: 'POST',
    summary: 'Sign in a user',
    tags: ['Authentication'],
  })
  .input(CredentialSchema)
  .output(TokenSchema)
  .handler(async ({ input, context }) => {
    return { token: 'token' }
  })
