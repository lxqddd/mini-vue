import { track, trigger } from './effect'

type TGetterRet<T> = (target: object, key: string) => string extends keyof T ? T[keyof T & string] : any
type TSetterRet<T> = (target: T, key: string, value: any) => boolean

export function createGetter<T extends object>(isReadonly: boolean): TGetterRet<T> {
  return function (target: T, key: string) {
    const res = Reflect.get(target, key)
    if (!isReadonly) {
      track(target, key)
    }
    return res
  }
}

export function createSetter<T extends object>(isReadonly: boolean): TSetterRet<T> {
  return function (target: T, key: string, value: any) {
    if (!isReadonly) {
      Reflect.set(target, key, value)
      trigger(target, key)
    } else {
      console.warn(`key ${key} can't be set, because target ${target} is read only!`)
    }
    return true
  }
}

export const mutableHandler = {
  get: createGetter(false),
  set: createSetter(false)
}

export const readonlyHandler = {
  get: createGetter(true),
  set: createSetter(true)
}
