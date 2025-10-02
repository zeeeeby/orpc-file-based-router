// This file is auto-generated

import { me2 } from "./routes/auth/me-kebab"
import { me } from "./routes/auth/me"
import { signin } from "./routes/auth/signin"
import { signup } from "./routes/auth/signup"
import { createPlanet } from "./routes/planets/create"
import { indexRoute } from "./routes/planets/index"
import { listPlanets } from "./routes/planets/list"
import { findPlanet } from "./routes/planets/{id}/find"
import { updatePlanet } from "./routes/planets/{id}/update"
import { sse } from "./routes/sse"

export const router = {
  auth: {
    "me-kebab": me2.route({ path: '/auth/me-kebab' }),
    me: me.route({ path: '/auth/me' }),
    signin: signin.route({ path: '/auth/signin' }),
    signup: signup.route({ path: '/auth/signup' })
  },
  planets: {
    create: createPlanet.route({ path: '/planets/create' }),
    index: indexRoute.route({ path: '/planets' }),
    list: listPlanets.route({ path: '/planets/list' }),
    find: findPlanet.route({ path: '/planets/{id}/find' }),
    update: updatePlanet.route({ path: '/planets/{id}/update' })
  },
  sse: sse.route({ path: '/sse' })
}