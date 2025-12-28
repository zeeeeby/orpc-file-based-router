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

3. Each file should export an oRPC function (non-oRPC exports will be ignored)

4. Generate your router before starting the server using the `generateRouter` function:

```typescript
// router-gen.ts
import { generateRouter } from "orpc-file-based-router";

const routesDir = new URL("./routes", import.meta.url).pathname;
const outputFile = new URL("./router.ts", import.meta.url).pathname;

generateRouter(routesDir, outputFile);
```

5. Import and use the generated router in your server:

```typescript
import { RPCHandler } from "@orpc/server/node";
import { router } from "./router.js"; // Import the generated router

const handler = new RPCHandler(router);
```

## 🔒 Enhanced Type-Safe Client Configuration

After generating your router (as shown in step 4 above), you can use it in your client:

```typescript
// lib/orpc.ts
import { router } from "../router.js"; // Use the same generated router
const client: RouterClient<typeof router> = createORPCClient(link)
```


## 🛠 Configuration Options

When using `generateRouter`, you can provide additional options to customize the output:

| Field              | Type      | Required | Default Value | Description                                                                                                                     |
|-------------------|----------|--------------|-----------------------|------------------------------------------------------------------------------------------------------------------------------|
| `importExtension` | string   | false         | `""`(No extension) | File extension to append to import statements in the generated router. Useful when your build setup requires specific extensions. <br>Example: `.js` → `import { me } from "./routes/auth/me.js"` |
| `additionalMethods` | string[]   | false         | `[]` | Additional HTTP methods to recognize from export names.   |


## Examples
### HTTP Method Matching
If you export functions named e.g. `get`, `post`, `put`, `patch`, `delete/del` etc. from a route file, those will get matched their corresponding http method automatically.

```typescript
// ./routes/planets.ts

export const get = orpc.handler(async ({ input, context }) => {})

export const post = orpc.handler(async ({ input, context }) => {})
```

## 📄 License

MIT License - feel free to use this in your own projects!
