import { os } from '@orpc/server'
import { NewUserSchema, UserSchema } from '../../schemas/user'

export const signup = os
  .route({
    method: 'POST',
    summary: 'Sign up a new user',
    tags: ['Authentication'],
  })
  .input(NewUserSchema)
  .output(UserSchema)
  .handler(async ({ input, context }) => {
    return {
      id: '28aa6286-48e9-4f23-adea-3486c86acd55',
      email: input.email,
      name: input.name,
    }
  })
