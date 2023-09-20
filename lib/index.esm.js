const targetMap = new Map();
// 收集依赖
function track(target, key) {
    let depMap = targetMap.get(target);
    if (!depMap) {
        depMap = new Map();
        targetMap.set(target, depMap);
    }
    let dep = depMap.get(key);
    if (!dep) {
        dep = new Set();
        depMap.set(key, dep);
    }
    return;
}
function trigger(target, key) {
    const depMap = targetMap.get(target);
    const dep = depMap.get(key);
    dep === null || dep === void 0 ? void 0 : dep.forEach((activeEffect) => {
        if (!activeEffect)
            return;
        if (activeEffect.scheduler) {
            activeEffect.scheduler();
        }
        else {
            activeEffect.run();
        }
    });
}
/**
 * getter -> track -> 将副作用函数收集到一个Set中
 * setter -> trigger -> 遍历Set，挨个执行遍历到的副作用函数
 *
 * 什么是副作用函数：
 * 在执行的时候，会对函数外部的变量产生影响
 */

var ReactiveFlags;
(function (ReactiveFlags) {
    ReactiveFlags["IS_REACTIVE"] = "_v_is_reactive";
})(ReactiveFlags || (ReactiveFlags = {}));
function createGetter(isReadonly) {
    return function (target, key) {
        const res = Reflect.get(target, key);
        if (!isReadonly) {
            track(target, key);
        }
        return res;
    };
}
function createSetter(isReadonly) {
    return function (target, key, value) {
        if (!isReadonly) {
            Reflect.set(target, key, value);
            trigger(target, key);
        }
        else {
            console.warn(`key ${key} can't be set, because target ${target} is read only!`);
        }
        return true;
    };
}
const mutableHandler = {
    get: createGetter(false),
    set: createSetter(false)
};

function crateActiveObject(raw, baseHandler) {
    return new Proxy(raw, baseHandler);
}
function reactive(raw) {
    return crateActiveObject(raw, mutableHandler);
}

export { reactive };
