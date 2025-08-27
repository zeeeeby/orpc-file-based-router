import type { z } from 'zod'
import type { UserSchema } from './schemas/user'
import { ORPCError, os } from '@orpc/server'
import { dbProviderMiddleware } from './middlewares/db'

export interface ORPCContext {
  user?: z.infer<typeof UserSchema>
}

export const pub = os
  .$context<ORPCContext>()
  .use(dbProviderMiddleware)

export const authed = os.$context<ORPCContext>()
  .use(dbProviderMiddleware)
  .use(({ context, next }) => {
    if (!context.user) {
      throw new ORPCError('UNAUTHORIZED')
    }

    return next({
      context: {
        user: context.user,
      },
    })
  })
