# orpc-file-based-router

A plugin for [oRPC](https://orpc.unnoq.com) that automatically generates an oRPC router configuration based on your file
structure, inspired by Next.js and express-file-routing approaches.

## ✨ Highlights

- 📁 **File-based Structure**: Organize your API endpoints intuitively through your filesystem
- 🔄 **Zero Configuration**: Generate routes automatically based on your directory structure
- ⚡️ **Development Speed**: Eliminate boilerplate code and reduce maintenance overhead
- 🔍 **Dynamic Routing**: Support for path parameters using `{param}` syntax in file names

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
**Note:** If your environment doesn't support top-level await, just use `lazy` for example in expressjs it could be:
```typescript
import { RPCHandler } from "@orpc/server/node";
import { lazy, createRouter } from "orpc-file-based-router";

const routesDir = new URL("./routes", import.meta.url).pathname;

const router = lazy(() => createRouter(routesDir))

app.use('/rpc{/*path}', async (req, res, next) => {

    const handler = new RPCHandler(await router());

    const { matched } = await handler.handle(req, res, {
        prefix: '/rpc',
    })

    if (matched) {
        return
    }

    next()
})
```

## 🔒 Type-Safe Client Configuration (Optional)

For users of the [oRPC client](https://orpc.unnoq.com/docs/client/client-side), we provide automatic configuration generation for enhanced type safety and improved developer experience.

1. You can add this code either directly in your server project (e.g., in server.ts or main.ts) or put it into a separate script (e.g., router-gen.ts).

```typescript
import { generateRouter } from "orpc-file-based-router";

const routesDir = new URL("./routes", import.meta.url).pathname;
const outputFile = new URL("./router.ts", import.meta.url).pathname;
generateRouter(routesDir, outputFile);
```

2. Generated router is ready to use in client:

> ⚠️ If you don't want plugin to generate openapi `route({})` suffix, just set parameter `includeRoute` to `false`

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

## 🛠 Configuration Options

When using `generateRouter`, you can provide additional options to customize the output:

| Field              | Type      | Required | Default Value | Description                                                                                                                     |
|-------------------|----------|--------------|-----------------------|------------------------------------------------------------------------------------------------------------------------------|
| `importExtension` | string   | false         | `""`(No extension) | File extension to append to import statements in the generated router. Useful when your build setup requires specific extensions. <br>Example: `.js` → `import { me } from "./routes/auth/me.js"` |
| `includeRoute` | boolean   | false         | `true` | When set to true, each route will be wrapped with openapi `.route({ path: '...' })` call   |



## 📄 License

MIT License - feel free to use this in your own projects!
