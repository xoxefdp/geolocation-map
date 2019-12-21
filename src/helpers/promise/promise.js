const STATE_FULFILLED = 'fulfilled'

/**
* Returns a promise that will be resolved if any of the given promises is resolved
* and rejected if ALL of the given promises are rejected. Acts as a wrapper of
* rsvp.Promises.allSettled but ignoring the specific result of each promise
* @param {Array<Promise>} promises
* @return {Promise}
*/
function anyPromise(promises) {
  return new Promise(
    (resolve, reject) => {
      let resolved = false,
        i, len,
        fails = 0
      const onSuccess = function() {
        !resolved && resolve()
        resolved = true
      }

      const onError = function() {
        ++fails
        // eslint-disable-next-line prefer-promise-reject-errors
        fails === len && reject()
      }

      for (i = 0, len = promises.length; i < len; i++) {
        promises[ i ]
          .then(onSuccess)
          .catch(onError)
      }
    }
  )
};

/**
* Checks if the given object is a promise or not
* @param {Promise} promise
* @return {Boolean} true if is a promise, false otherwise.
*/
function isPromise(promise) {
  return !!(promise &&
    typeof promise.then === 'function' &&
    typeof promise.catch === 'function' &&
    typeof promise.finally === 'function')
};

/**
 * Inidicates if a promise has been fulfilled or not
 * @param  {Object} response
 * @return {Boolean}
 */
function isPromiseFulfilled(response) {
  return response && response.state === STATE_FULFILLED
}

export {
  anyPromise,
  isPromise,
  isPromiseFulfilled,
}
