import { describe, expect, it } from 'vitest'
import { reactive } from '../reactive'

describe('reactive', () => {
  it('happy path', () => {
    const original = {
      age: 18
    }
    const observed = reactive(original)

    expect(observed).not.toBeNull()
    expect(observed).not.toBe(original)
    observed.age += 1

    expect(observed.age).toBe(19)
    expect(original.age).toEqual(19)
  })
})
