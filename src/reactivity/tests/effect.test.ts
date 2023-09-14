import { describe, expect, it, vi } from 'vitest'
import { reactive } from '../reactive'
import { effect, stop } from '../effect'

describe('effect', () => {
  it('happy path', () => {
    const user = reactive({
      age: 18
    })

    let nextAge
    effect(() => {
      nextAge = user.age + 1
    })
    expect(nextAge).toBe(19)
    user.age++
    expect(nextAge).toBe(20)
  })

  it('runner', () => {
    let foo = 10

    const runner = effect(() => {
      foo++
      return 'hello world'
    })
    expect(foo).toBe(11)
    expect(runner()).toBe('hello world')
    expect(foo).toBe(12)
  })

  it('scheduler', () => {
    let dummy: number = 0
    let run: Function | null = null

    const obj = reactive({
      foo: 1
    })
    const scheduler = vi.fn(() => {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      run = runner
    })

    const runner = effect(
      () => {
        dummy = obj.foo
      },
      { scheduler }
    )

    expect(scheduler).not.toHaveBeenCalled()
    expect(dummy).toBe(1)
    obj.foo++
    expect(scheduler).toHaveBeenCalledTimes(1)
    expect(dummy).toBe(1)
    run!()
    expect(dummy).toBe(2)
  })

  it('stop', () => {
    let dummy: number = 0
    const obj = reactive({ prop: 1 })
    const runner = effect(() => {
      dummy = obj.prop
    })
    obj.prop = 2
    expect(dummy).toBe(2)
    stop(runner)
    obj.prop = 3
    expect(dummy).toBe(2)
    runner()
    expect(dummy).toBe(3)
  })

  it('onStop', () => {
    const obj = reactive({
      foo: 1
    })
    const onStop = vi.fn()
    let dummy: number = 0
    const runner = effect(
      () => {
        dummy = obj.foo
      },
      {
        onStop
      }
    )
    stop(runner)
    expect(onStop).toBeCalledTimes(1)
  })
})
