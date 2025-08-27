import { z } from 'zod'
import { retry } from '../../middlewares/retry'
import { pub } from '../../orpc'
import { PlanetSchema } from '../../schemas/planet'

export const indexRoute = pub
  .use(retry({ times: 3 }))
  .route({
    method: 'GET',
    summary: 'Index route',
    tags: ['Planets'],
  })
  .input(
    z.object({
      limit: z.number().int().min(1).max(100).default(10),
      cursor: z.number().int().min(0).default(0),
    }),
  )
  .output(z.array(PlanetSchema))
  .handler(async ({ input, context }) => {
    return context.db.planets.list(input.limit, input.cursor)
  })
