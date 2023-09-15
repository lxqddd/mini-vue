import { mutableHandler, readonlyHandler } from './baseHandlers'

function crateActiveObject<T extends object>(raw: T, baseHandler: ProxyHandler<object>) {
  return new Proxy(raw, baseHandler) as T
}

export function reactive<T extends object>(raw: T): T {
  return crateActiveObject(raw, mutableHandler)
}

export function readonly<T extends object>(raw: T): T {
  return crateActiveObject(raw, readonlyHandler)
}
