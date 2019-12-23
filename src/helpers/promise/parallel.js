import { requestLogger } from 'the-browser-logger'

const promisesCache = {}

const _getLogger = () => {
  return requestLogger('ParallelPromises')
}

/**
 * Checks for a promise with the given transaction Id
 * @param {String} transactionId
 * @return {Boolean}
 */
const hasParallelPromise = (transactionId) => {
  DEBUG && _getLogger().debug('hasParallelPromise()', transactionId)
  return !!promisesCache[ transactionId ]
}

/**
 * Gets the same promise for an operation if the first call has not been finished.
 * @param {String} transactionId
 * @param {Function} callback
 * @return {Promise}
 */
const getParallelPromise = (transactionId, callback) => {
  let promise = promisesCache[ transactionId ]

  if (!promise) {
    promisesCache[ transactionId ] = promise = new Promise(
      (resolve, reject) => callback(resolve, reject)
    )
    promise.finally(() => delete promisesCache[ transactionId ])
  }

  DEBUG && _getLogger().debug('getParallelPromise()', transactionId)
  return promise
}

export {
  getParallelPromise,
  hasParallelPromise,
}