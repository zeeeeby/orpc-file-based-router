import { NewPlanetSchema, PlanetSchema } from '../../schemas/planet'
import { authed } from '../../orpc'

export const createPlanet = authed
  .route({
    method: 'POST',
    summary: 'Create a planet',
    tags: ['Planets'],
  })
  .input(NewPlanetSchema)
  .output(PlanetSchema)
  .handler(async ({ input, context }) => {
    return context.db.planets.create(input, context.user)
  })
