# orpc-file-based-router

A plugin for [oRPC](https://orpc.unnoq.com) that automatically creates an oRPC router configuration based on your file
structure, similar to Next.js, express-file-routing

## Highlights

- 📁 **File-based structure**: Organize your API endpoints intuitively through your filesystem
- 🔄 **Zero configuration**: Generate routes automatically based on your directory structure
- ⚡️ **Development speed**: Eliminate boilerplate code and reduce maintenance overhead
- 🔍 **Dynamic routing**: Support for path parameters using `{param}` syntax in file names
- 📑 **Index handling**: Support for index routes via `index.ts` files

> ⚠️ **IMPORTANT:** At this time, the plugin's functionality is only guaranteed
> in nodejs runtime

## Quickstart

0. If you're new to oRPC, read the [oRPC documentation](https://orpc.unnoq.com). Install and configure a basic oRPC server

1. Install package

```bash
npm install orpc-file-based-router
# or
yarn add orpc-file-based-router
```

2. Create a routes directory structure (for example):

```
src/routes
  ├── auth
  │    ├── me.ts 
  │    ├── signin.ts 
  │    └── signup.ts 
  │
  ├── planets
  │    ├── {id}
  │    │    ├── find.ts 
  │    │    └── update.ts 
  │    │
  │    ├── create.ts 
  │    ├── index.ts 
  │    └── list.ts 
  │
  └── sse.ts
```

3. Each file should export an oRPC function 

4. Simply replace router in your handlers with the result of the `createRouter`
function:

```typescript
import { RPCHandler } from "@orpc/server/node";
import { createRouter } from "orpc-file-based-router";

const routesDir = new URL("./routes", import.meta.url).pathname;
const router = await createRouter(routesDir);

const handler = new RPCHandler(router);

```
> **Note:** If your environment doesn't support top-level await, wrap your server startup code in an async function:
> ```typescript
> async function startServer() {
>   const router = await createRouter(routesDir);
>   const handler = new RPCHandler(router);
>   // ... start your server
> }
> startServer();
> ```

## Type-Safe Client Configuration (Optional)

If you plan to use [oRPC client](https://orpc.unnoq.com/docs/client/client-side), you can set up automatic configuration generation, which can be used for client typing.

1. Add the following code to your main server file (e.g., `server.ts` or `main.ts`) or anywhere else. This will automatically regenerate the router configuration each time your server starts:

```typescript
import { generateRouter } from "orpc-file-based-router";

const routesDir = new URL("./routes", import.meta.url).pathname;
const outputFile = new URL("./router.ts", import.meta.url).pathname;
generateRouter(routesDir, outputFile);
```

2. Generated router is ready to use in client:

```typescript
// router.ts
import { me } from "./routes/auth/me";
import { signin } from "./routes/auth/signin";
import { signup } from "./routes/auth/signup";
import { createPlanet } from "./routes/planets/create";
import { indexRoute } from "./routes/planets";
import { listPlanets } from "./routes/planets/list";
import { findPlanet } from "./routes/planets/{id}/find";
import { updatePlanet } from "./routes/planets/{id}/update";
import { sse } from "./routes/sse";

export const router = {
  auth: {
    me: me.route({ path: "/auth/me" }),
    signin: signin.route({ path: "/auth/signin" }),
    signup: signup.route({ path: "/auth/signup" }),
  },
  planets: {
    create: createPlanet.route({ path: "/planets/create" }),
    indexRoute: indexRoute.route({ path: "/planets" }),
    list: listPlanets.route({ path: "/planets/list" }),
    find: findPlanet.route({ path: "/planets/{id}/find" }),
    update: updatePlanet.route({ path: "/planets/{id}/update" }),
  },
  sse: sse.route({ path: "/sse" }),
};

// lib/orpc.ts
const client: RouterClient<typeof router> = createORPCClient(link)

```

## License

MIT
