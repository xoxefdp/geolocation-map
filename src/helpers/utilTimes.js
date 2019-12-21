import { Time } from 'helpers/time/TimeConstants'

/**
 * @returns {Miliseconds}
 */
const getCurrentInTimestamp = () => {
  const timestamp = Date.now()
  return timestamp
}

/**
 * @returns {Seconds}
 */
const getCurrentTimeInSeconds = () => {
  const seconds = Date.now() / Time.SECOND // ms to secs
  return seconds
}

export {
  getCurrentInTimestamp,
  getCurrentTimeInSeconds,
}
