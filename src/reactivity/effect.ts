import { extend } from '../shared'

interface IRunner {
  (): any
  effect?: ReactiveEffect
}

const targetMap = new Map<any, Map<any, Set<ReactiveEffect>>>()
let activeEffect: ReactiveEffect
let shouldTrack: boolean

function cleanupDeps(activeEffect: ReactiveEffect) {
  activeEffect.deps.forEach((dep) => {
    dep.clear()
  })
}

class ReactiveEffect {
  private _fn: Function
  public deps = new Set<Set<ReactiveEffect>>()
  onStop?: Function
  constructor(fn: Function, public scheduler?: Function) {
    this._fn = fn
  }

  run() {
    activeEffect = this

    return this._fn()
  }

  stop() {
    cleanupDeps(activeEffect)
    this.onStop && this.onStop()
  }
}

// 收集依赖
export function track(target: object, key: string | symbol) {
  let depMap = targetMap.get(target)
  if (!depMap) {
    depMap = new Map()
    targetMap.set(target, depMap)
  }
  let dep = depMap.get(key)
  if (!dep) {
    dep = new Set<any>()
    depMap.set(key, dep)
  }
  if (!activeEffect)
    return
  dep.add(activeEffect)
  activeEffect.deps.add(dep)
}

export function trigger<T>(target: T, key: string | symbol) {
  const depMap = targetMap.get(target)!
  const dep = depMap.get(key)
  dep?.forEach((activeEffect) => {
    if (!activeEffect)
      return
    if (activeEffect.scheduler) {
      activeEffect.scheduler()
    } else {
      activeEffect.run()
    }
  })
}

export function effect<T extends Function>(fn: T, options: { scheduler?: Function; onStop?: Function } = {}) {
  const _effect = new ReactiveEffect(fn, options.scheduler)
  _effect.run()
  extend(_effect, options)

  const runner: IRunner = _effect.run.bind(_effect)
  runner.effect = _effect
  return runner
}

export function stop(runner: IRunner) {
  runner.effect?.stop()
}
