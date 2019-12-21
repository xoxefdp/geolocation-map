const HttpMethod = {
    GET: 'GET',
    HEAD: 'HEAD',
    POST: 'POST',
    PUT: 'PUT',
    PATCH: 'PATCH',
    DELETE: 'DELETE',
    OPTIONS: 'OPTIONS',
    CONNECT: 'CONNECT',
    TRACE: 'TRACE',
  },
  XML_HTTP_REQUEST_EVENT = {
    ON_ABORT: 'onabort',
    ON_ERROR: 'onerror',
    ON_LOAD: 'onload',
    ON_LOADEND: 'onloadend',
    ON_LOADSTART: 'onloadstart',
    ON_PROGRESS: 'onprogress',
    ON_TIMEOUT: 'ontimeout',
    ON_READY_STATE_CHANGE: 'onreadystatechange',
  }

export {
  HttpMethod,
  XML_HTTP_REQUEST_EVENT,
}
