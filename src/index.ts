import type { ParsedPath } from 'node:path'
import { readdirSync, statSync, writeFileSync } from 'node:fs'
import path, { dirname, join, relative } from 'node:path'
import { getMethodKey, isMethodExport } from './utils'

type ModuleFile = {
    name: string
    path: string
    rel: string
}

/**
 * Recursively walk a directory and return all nested files.
 *
 * @param directory The directory path to walk recursively
 * @param tree The tree of directories leading to the current directory
 *
 * @returns An array of all nested files in the specified directory
 */
function walkTree(directory: string, tree: string[] = []) {
    const results: ModuleFile[] = []

    for (const fileName of readdirSync(directory)) {
        const filePath = join(directory, fileName)
        const fileStats = statSync(filePath)

        if (fileStats.isDirectory()) {
            results.push(...walkTree(filePath, [...tree, fileName]))
        }
        else {
            results.push({
                name: fileName,
                path: directory,
                rel: mergePaths(...tree, fileName),
            })
        }
    }

    return results
}

function mergePaths(...paths: string[]) {
    return `/${paths
        .map(path => path.replace(/^\/|\/$/g, ''))
        .filter(path => path !== '')
        .join('/')}`
}


export async function createRouter(routesDir: string) {
    const files = walkTree(
        routesDir,
    )
    const exports = await generateRoutes(files)

    return buildRouter(exports, (r, e) => {
        return (r.exports[e] as any).route({ path: `${r.path}` })
    })
}

export const lazy = <T>(create: () => Promise<T> | T) => {
    let cache: Promise<T> | null = null


    const fn = () => {
        if (!cache) {
            cache = Promise.resolve(create())
        }
        return cache
    }

    fn.reset = () => { cache = null }
    return fn
}

type GeneratorOptions = {
    // <!-- INJECT_GENERATOR_OPTIONS_MARKDOWN_TABLE -->   
    /**
     * File extension to append to import statements in the generated router.
     * Useful when your build setup requires specific extensions.
     * @example ".js" will generate imports like: import { me } from "./routes/auth/me.js"
     * @default "" (no extension)
     */
    importExtension?: string
    /**
     * When set to true, each route will be wrapped with OpenAPI .route({ path: '...', method: '...' }) call
     * @default true
     */
    enableOpenAPI?: boolean
    /**
     * Additional HTTP methods to recognize from export names.
     */
    additionalMethods?: string[]
}
export async function generateRouter(routesDir: string, outputFile: string, options?: GeneratorOptions) {
    const files = walkTree(
        routesDir,
    )

    const exports = await generateRoutes(files)

    const importPaths = exports.map(x => relative(dirname(outputFile), routesDir).concat(x.path))

    const content = buildRouter(exports, (r, e) => {
        const alias = routePathToAlias(r.path, e)
        if (options?.enableOpenAPI ?? true) {
            const orpcMeta = isORPCProcedure(r.exports[e] as any) ? (r.exports[e] as any)['~orpc'] : undefined
            const method = isMethodExport(e, options?.additionalMethods || []) ? getMethodKey(e) : orpcMeta?.route?.method || "POST"
            const config = { path: r.path.replace(/\/{0,1}index$/, ""), method: method }
            return `${alias}.route({ path: '${config.path}', method: '${config.method}' })`
        }
        return alias
    })

    let routerContent = `// This file is auto-generated\n\n`
    const extension = options?.importExtension || ""

    routerContent += importPaths
        .map((x, i) => `import { ${Object.keys(exports[i]!.exports)
            .map(y => `${y} as ${routePathToAlias(exports[i]!.path, y)}`)
            .join(', ')} } from "./${x}${extension}"`)
        .join('\n')

    routerContent += '\n\nexport const router = '
    // eslint-disable-next-line ban/ban
    routerContent += JSON.stringify(content, null, 2)
        .replace(/"/g, '')
        .replace(/(\s*)([a-zA-Z0-9]+-[a-zA-Z0-9-]+):/g, '$1"$2":');

    writeFileSync(join(outputFile), routerContent)
}

function routePathToAlias(routePath: string, methodName: string) {
    const cleanPath = routePath.replace(/\{(\w+)\}/g, '$1').replace(/-/g, '_')
    return cleanPath.split("/").filter(Boolean).join("_") + "__" + methodName
}

function buildRoutePath(parsedFile: ParsedPath) {
    const directory = parsedFile.dir === parsedFile.root ? '' : parsedFile.dir
    const name = `/${parsedFile.name}`

    return directory + name
}

type Router = Record<string, any>
function buildRouter(routes: Route[], mapper: (currentRoute: Route, currentExport: string) => any) {
    const router = {} as Router
    for (const route of routes) {
        const segments = route.path.replace(/\{\w+\}/g, '').replace(/\/\//g, '/').split('/').filter(Boolean)

        let current = router
        for (let i = 0; i < segments.length; i++) {
            const segment = segments[i]!

            if (i === segments.length - 1) {
                current[segment] = current[segment] || {}
                for (const exp in route.exports) {
                    current[segment][exp] = mapper(route, exp)
                }
            }
            else {
                current[segment] = current[segment] || {}
                current = current[segment]
            }
        }
    }
    return simplifyRouter(router)
}

/**
 * Simplifies a nested router structure by flattening single-child branches.
 *
 * For example, if a router branch has only one child that is a string (route),
 * that child's value will be promoted to replace its parent node.
 * This helps create a more concise and cleaner router structure.
 *
 * @param router The router object to simplify
 * @returns A simplified version of the router with unnecessary nesting removed
 */
function simplifyRouter(router: Router) {
    let simplifiedRouter = {} as Router

    for (const key in router) {
        if (isLeaf(router[key])) {
            simplifiedRouter[key] = router[key]
        }
        else if (hasSingleLeaf(router[key])) {
            const childKey = Object.keys(router[key])[0]!
            simplifiedRouter[key] = router[key][childKey]
        }
        else {
            simplifiedRouter[key] = simplifyRouter(router[key])
        }
    }

    return simplifiedRouter
}
function isORPCProcedure(obj: Router) {
    return '~orpc' in obj
}
function isLeaf(obj: Router) {
    return typeof obj === "string" || isORPCProcedure(obj)
}
function hasSingleLeaf(obj: Router) {
    const keys = Object.keys(obj)
    return keys.length === 1 && isLeaf(obj[keys[0]!])
}

type RouteModule = {
    [key: string]: unknown;
}

type Route = {
    exports: RouteModule
    path: string
}
const isCjs = () => typeof module !== 'undefined' && !!module?.exports

const IS_ESM = !isCjs()

const MODULE_IMPORT_PREFIX = IS_ESM ? 'file://' : ''

async function generateRoutes(files: ModuleFile[]) {
    const routes: Route[] = []

    for (const file of files) {
        const parsedFile = path.parse(file.rel)

        const routePath = buildRoutePath(parsedFile)
        const exports = await import(
            MODULE_IMPORT_PREFIX + path.join(file.path, file.name)
        )

        routes.push({
            exports,
            path: routePath,
        })
    }

    return routes
}
