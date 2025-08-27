import { UserSchema } from '../../schemas/user'
import { authed } from '../../orpc'

export const me = authed
  .route({
    method: 'GET',
    summary: 'Get the current user',
    tags: ['Authentication'],
  })
  .output(UserSchema)
  .handler(async ({ input, context }) => {
    return context.user
  })
