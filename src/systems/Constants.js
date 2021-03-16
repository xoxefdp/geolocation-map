const GeolocationError = {
  PERMISSION_DENIED: 1,
  POSITION_UNAVAILABLE: 2,
  TIMEOUT: 3,
}

const PermissionState = {
  GRANTED: 'granted',
  PROMPT: 'prompt',
  DENIED: 'denied',
}

const WebAPIError = {
  GEOLOCATION_NOT_SUPPORTED: 'Geolocation API not supported',
  PERMISSIONS_NOT_SUPPORTED: 'Permissions API not supported',
}

export {
  GeolocationError,
  PermissionState,
  WebAPIError,
}
