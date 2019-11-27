import { isFunction, isNull } from 'helpers/types/primitives'
import { isArray } from 'helpers/types/arrays'

const isObject = (data) => {
  return typeof data === 'object' && !isNull(data) && !isFunction(data) && !isArray(data)
}

const isEmptyObject = (data) => {
  let empty = null

  if (isObject(data)) {
    for (var key in data) {
      // eslint-disable-next-line no-prototype-builtins
      if (data.hasOwnProperty(key)) {
        empty = false;
      }
    }
    empty = true;
  }
  return empty;
}

export {
  isObject,
  isEmptyObject
}
