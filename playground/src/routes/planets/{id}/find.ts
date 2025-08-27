import { ORPCError } from '@orpc/client'
import { z } from 'zod'
import { retry } from '../../../middlewares/retry'
import { pub } from '../../../orpc'
import { PlanetSchema } from '../../../schemas/planet'

export const findPlanet = pub
  .use(retry({ times: 3 }))
  .route({
    method: 'GET',
    summary: 'Find a planet',
    tags: ['Planets'],
  })
  .input(
    z.object({
      id: z.number().int().min(1),
    }),
  )
  .output(PlanetSchema)
  .handler(async ({ input, context }) => {
    const planet = await context.db.planets.find(input.id)

    if (!planet) {
      throw new ORPCError('NOT_FOUND', { message: 'Planet not found' })
    }

    return planet
  })
