import { Time } from 'helpers/time/TimeConstants'
import { HttpMethod } from 'helpers/http/HttpConstants'

const State = {
    CONNECTED: 'CONNECTED',
    CHECKING: 'CHECKING',
    DISCONNECTED: 'DISCONNECTED',
  },
  TIME_CHECK_INTERNET_CONNECTED = Time.HOUR,
  TIME_CHECK_INTERNET_DISCONNECTED = 20 * Time.SECOND,
  CHECK_URL_TIMEOUT = 10 * Time.SECOND,
  CHECK_INTERNET_URLS = [
    { url: 'https://google.com', method: HttpMethod.HEAD }, // USA
    { url: 'https://yandex.ru', method: HttpMethod.HEAD }, // Rusia
    { url: 'https://baidu.com', method: HttpMethod.HEAD }, // China
    // { url: 'http://131.100.1.18', method: HttpMethod.HEAD }, // Colombia
    // { url: 'http://37.252.251.10', method: HttpMethod.HEAD }, // Chile
    // { url: 'https://httpstat.us/200', method: HttpMethod.HEAD },
  ],
  CHECK_CONNECTION_TIMER_ID = 'CheckConnection'

export {
  State,
  TIME_CHECK_INTERNET_CONNECTED,
  TIME_CHECK_INTERNET_DISCONNECTED,
  CHECK_URL_TIMEOUT,
  CHECK_INTERNET_URLS,
  CHECK_CONNECTION_TIMER_ID,
}
