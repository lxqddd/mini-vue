export function readonly<T extends object>(raw: T) {
  return new Proxy(raw, {
    get(target, key) {
      return Reflect.get(target, key)
    },
    set(target, key) {
      return true
    }
  })
}
