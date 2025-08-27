import { generateRouter } from '../../src'

const routesDir = new URL('./routes', import.meta.url).pathname
const outputFile = new URL('./router.ts', import.meta.url).pathname

generateRouter(routesDir, outputFile)
  .then(() => console.log('Router generated successfully'))
  .catch(console.error)
