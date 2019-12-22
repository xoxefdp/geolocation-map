import { isArray } from 'the-type-validator'

const set = (obj, path, value) => {
  if (Object(obj) !== obj) {
    // When obj is not an object
    return obj
  }
  // If not yet an array, get the keys from the string-path
  if (!isArray(path)) {
    path = path.toString().match(/[^.[\]]+/g) || []
  }
  path.slice(0, -1).reduce(
    // Iterate all of them except the last one
    (a, c, i) =>
      // Does the key exist and is its value an object?
      Object(a[ c ]) === a[ c ]
        // Yes: then follow that path
        ? a[ c ]
        // No: create the key. Is the next key a potential array-index?
        : a[ c ] = Math.abs(path[ i + 1 ]) >> 0 === +path [ i + 1 ]
          // Yes: assign a new array object
          ? []
          // No: assign a new plain object
          : {}
    // Finally assign the value to the last key
    , obj)[ path[ path.length - 1 ] ] = value
  // Return the top-level object to allow chaining
  return obj
}

export {
  set,
}
