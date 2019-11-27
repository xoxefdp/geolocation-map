import { isNull, isUndefined, isFunction, isString } from 'helpers/types/primitives'
import { isNumber, isInteger, isFloat } from 'helpers/types/numbers'
import { isArray, isEmptyArray } from 'helpers/types/arrays'
import { isObject, isEmptyObject } from 'helpers/types/objects'

const isEmpty = (data) => {
  return isEmptyArray(data) || isEmptyObject(data)
}

export {
  isNull,
  isUndefined,
  isFunction,
  isString,
  isNumber,
  isInteger,
  isFloat,
  isArray,
  isEmptyArray,
  isObject,
  isEmptyObject,
  isEmpty
}
