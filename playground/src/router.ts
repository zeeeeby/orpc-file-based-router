// This file is auto-generated

import { get } from "./routes/auth/me-kebab"
import { GET } from "./routes/auth/me-kebab"
import { get } from "./routes/auth/me"
import { GET } from "./routes/auth/me"
import { POST } from "./routes/auth/signin"
import { POST } from "./routes/auth/signup"
import { POST } from "./routes/planets/create"
import { GET } from "./routes/planets"
import { GET } from "./routes/planets/list"
import { GET } from "./routes/planets/{id}/find"
import { PUT } from "./routes/planets/{id}/update"
import { GET } from "./routes/sse"

export const router = {
  auth: {
    me-kebab: {
      get: get.route({ path: '/auth/me-kebab', method: 'GET' }),
      GET: GET.route({ path: '/auth/me-kebab', method: 'GET' })
    },
    me: {
      get: get.route({ path: '/auth/me', method: 'GET' }),
      GET: GET.route({ path: '/auth/me', method: 'GET' })
    },
    signin: POST.route({ path: '/auth/signin', method: 'POST' }),
    signup: POST.route({ path: '/auth/signup', method: 'POST' })
  },
  planets: {
    create: POST.route({ path: '/planets/create', method: 'POST' }),
    GET: GET.route({ path: '/planets', method: 'GET' }),
    list: GET.route({ path: '/planets/list', method: 'GET' }),
    find: GET.route({ path: '/planets/{id}/find', method: 'GET' }),
    update: PUT.route({ path: '/planets/{id}/update', method: 'PUT' })
  },
  sse: GET.route({ path: '/sse', method: 'GET' })
}