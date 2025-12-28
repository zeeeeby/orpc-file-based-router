// This file is auto-generated

import { me2 as auth_me_kebab__me2 } from "./routes/auth/me-kebab.js"
import { me as auth_me__me } from "./routes/auth/me.js"
import { signin as auth_signin__signin } from "./routes/auth/signin.js"
import { signup as auth_signup__signup } from "./routes/auth/signup.js"
import { createPlanet as planets_create__createPlanet } from "./routes/planets/create.js"
import { indexRoute as planets_index__indexRoute } from "./routes/planets/index.js"
import { listPlanets as planets_list__listPlanets } from "./routes/planets/list.js"
import { findPlanet as planets_id_find__findPlanet } from "./routes/planets/{id}/find.js"
import { updatePlanet as planets_id_update__updatePlanet } from "./routes/planets/{id}/update.js"
import { sse as sse__sse } from "./routes/sse.js"

export const router = {
  auth: {
    "me-kebab": auth_me_kebab__me2.route({ path: '/auth/me-kebab', method: 'GET' }),
    me: auth_me__me.route({ path: '/auth/me', method: 'GET' }),
    signin: auth_signin__signin.route({ path: '/auth/signin', method: 'POST' }),
    signup: auth_signup__signup.route({ path: '/auth/signup', method: 'POST' })
  },
  planets: {
    create: planets_create__createPlanet.route({ path: '/planets/create', method: 'POST' }),
    index: planets_index__indexRoute.route({ path: '/planets', method: 'GET' }),
    list: planets_list__listPlanets.route({ path: '/planets/list', method: 'GET' }),
    find: planets_id_find__findPlanet.route({ path: '/planets/{id}/find', method: 'GET' }),
    update: planets_id_update__updatePlanet.route({ path: '/planets/{id}/update', method: 'PUT' })
  },
  sse: sse__sse.route({ path: '/sse', method: 'GET' })
}