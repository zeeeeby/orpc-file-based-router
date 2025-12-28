import { METHOD_EXPORTS } from "./config"

export const getMethodKey = (method: string) => {
    let methodKey = method.toUpperCase()

    if (methodKey === "DEL") return "DELETE"

    return methodKey
}

export const isMethodExport = (exportName: string, extraMethods: string[]) => {
    const methods = [...METHOD_EXPORTS, ...extraMethods].map(getMethodKey)
    return methods.includes(getMethodKey(exportName))
}