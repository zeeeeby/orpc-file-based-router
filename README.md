# orpc-file-based-router

A plugin for [oRPC](https://orpc.unnoq.com) that automatically creates an oRPC router configuration based on your file structure.

## Installation

```bash
npm install orpc-file-based-router
# or
yarn add orpc-file-based-router
```

## Usage

```typescript
import { generateRouter } from 'orpc-file-based-router'

const routesDir = './routes'
const outputFile = './router.ts'

generateRouter(routesDir, outputFile)
  .then(() => console.log('Router generated successfully'))
  .catch(console.error)
```

### File Structure Example

```                                                                                                              
src/routes
  ├── auth
  │    ├── me.ts (exports: me)
  │    ├── signin.ts (exports: signin)
  │    └── signup.ts (exports: signup)
  │
  ├── planets
  │    ├── {id}
  │    │    ├── find.ts (exports: findPlanet)
  │    │    └── update.ts (exports: updatePlanet)
  │    │
  │    ├── create.ts (exports: createPlanet)
  │    ├── index.ts (exports: indexRoute)
  │    └── list.ts (exports: listPlanets)
  │
  └── sse.ts (exports: sse)
```

### Generated result

```typescript
import { me } from './routes/auth/me'
import { signin } from './routes/auth/signin'
import { signup } from './routes/auth/signup'
import { createPlanet } from './routes/planets/create'
import { indexRoute } from './routes/planets'
import { listPlanets } from './routes/planets/list'
import { findPlanet } from './routes/planets/{id}/find'
import { updatePlanet } from './routes/planets/{id}/update'
import { sse } from './routes/sse'

export const router = {
  auth: {
    me: me.route({ path: '/auth/me' }),
    signin: signin.route({ path: '/auth/signin' }),
    signup: signup.route({ path: '/auth/signup' }),
  },
  planets: {
    create: createPlanet.route({ path: '/planets/create' }),
    indexRoute: indexRoute.route({ path: '/planets' }),
    list: listPlanets.route({ path: '/planets/list' }),
    find: findPlanet.route({ path: '/planets/{id}/find' }),
    update: updatePlanet.route({ path: '/planets/{id}/update' }),
  },
  sse: sse.route({ path: '/sse' }),
}
```

