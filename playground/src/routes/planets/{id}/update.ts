import { z } from 'zod'
import { authed } from '../../../orpc'
import { PlanetSchema, UpdatePlanetSchema } from '../../../schemas/planet'

export const updatePlanet = authed
  .route({
    method: 'PUT',
    summary: 'Update a planet',
    tags: ['Planets'],
  })
  .errors({
    NOT_FOUND: {
      message: 'Planet not found',
      data: z.object({ id: UpdatePlanetSchema.shape.id }),
    },
  })
  .input(UpdatePlanetSchema)
  .output(PlanetSchema)
  .handler(async ({ input, context, errors }) => {
    const planet = await context.db.planets.find(input.id)

    if (!planet) {
      /**
       *  1. Type-Safe Error Handling
       *
       * {@link https://orpc.unnoq.com/docs/error-handling#type%E2%80%90safe-error-handling}
       */
      throw errors.NOT_FOUND({ data: { id: input.id } })

      /**
       * 2. Normal Approach
       *
       * {@link https://orpc.unnoq.com/docs/error-handling#normal-approach}
       */
      // throw new ORPCError('NOT_FOUND', { message: 'Planet not found' })
    }

    return context.db.planets.update(input)
  })
