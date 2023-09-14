import { describe, expect, it, vi } from 'vitest'
import { readonly } from '../reactive'

describe('readonly', () => {
  it('happy path', () => {
    const original = {
      foo: 1,
      bar: {
        baz: 2
      }
    }
    const wrapped = readonly(original)
    expect(wrapped).not.toBe(original)
    expect(wrapped.foo).toBe(1)
    wrapped.foo = 2
    expect(wrapped.foo).toBe(1)
  })

  it('warn when set be called', () => {
    console.warn = vi.fn()

    const user = readonly({
      foo: 1
    })
    user.foo = 2
    expect(console.warn).toBeCalled()
  })
})
