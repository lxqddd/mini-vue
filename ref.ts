function ref(val) {
  return createRef(val, false);
}

function isRef(val) {
  return val && val.__v_isRef === true;
}

function createRef(rawValue, shallow) {
  if (isRef(rawValue)) return rawValue;
  return new RefImpl(rawValue, shallow);
}

function toRaw(value) {
  console.log(value);
}

function toReactive(value) {
  console.log(value);
}

function trackRefValue(refImpl) {
  console.log(refImpl);
}

function hasChanged(newVal, oldVal) {
  console.log(newVal, oldVal);
  return true;
}

function triggerRefValue(ref, newValue) {
  console.log(ref, newValue);
}

class RefImpl<T> {
  private _value: T;
  private _rawValue: T;
  constructor(value, private _isShallow: boolean) {
    this._rawValue = _isShallow ? value : toRaw(value);
    this._value = _isShallow ? value : toReactive(value);
  }

  get value() {
    trackRefValue(this);
    return this._value;
  }

  set value(newVal) {
    newVal = this._isShallow ? newVal : toRaw(newVal);
    if (hasChanged(newVal, this._rawValue)) {
      this._rawValue = newVal;
      this._value = this._isShallow ? newVal : toReactive(newVal);
      triggerRefValue(this, newVal);
    }
  }
}
