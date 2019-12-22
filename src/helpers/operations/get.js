import { isNull, isUndefined, isArray } from 'the-type-validator'

const get = (object, path, defaultVal) => {
  const PATH = isArray(path)
    ? path
    : path.split('.').filter((i) => i.length)
  if (!PATH.length) {
    return isUndefined(object) ? defaultVal : object
  }
  if ( isNull(object) || isUndefined(object) || isUndefined(object[ PATH[ 0 ] ])) {
    return defaultVal
  }
  return get(object[ PATH.shift() ], PATH, defaultVal)
}

export {
  get,
}
