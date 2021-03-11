const BootEvent = {
  ON_APP_INITIATED: 'onAppInitiated',
  ON_APP_DESTROYED: 'onAppDestroyed',
  ON_APP_REBOOTED: 'onAppRebooted',
}

const GeolocationEvent = {
  ON_GEOLOCATION_CURRENT_POSITION_UPDATE: 'onGeolocationCurrentPositionUpdate',
  ON_GEOLOCATION_TRACKING_STARTED: 'onGeolocationTrackingStarted',
  ON_GEOLOCATION_TRACKING_STOPPED: 'onGeolocationTrackingStopped',
  // ERRORS
  ON_GEOLOCATION_PERMISSION_DENIED: 'onGeolocationPermissionDenied', // 1
  ON_GEOLOCATION_POSITION_UNAVAILABLE: 'onGeolocationPositionUnavailable', // 2
  ON_GEOLOCATION_TIMEOUT: 'onGeolocationTimeout', // 3
}

const PermissionEvent = {
  ON_PERMISSION_GRANTED: 'onPermissionGranted',
  ON_PERMISSION_PROMPT: 'onPermissionPrompt',
  ON_PERMISSION_DENIED: 'onPermissionDenied',
  // ERRORS
  ON_PERMISSION_WRONG_NAME: 'onPermissionWrongName',
}

const ComponentEvent = {
  ON_COMPONENT_BEFORE_CREATE: 'onComponentBeforeCreate',
  ON_COMPONENT_CREATED: 'onComponentCreated',
  ON_COMPONENT_BEFORE_MOUNT: 'onComponentBeforeMount',
  ON_COMPONENT_MOUNTED: 'onComponentMounted',
  ON_COMPONENT_BEFORE_UPDATE: 'onComponentBeforeUpdate',
  ON_COMPONENT_UPDATED: 'onComponentUpdated',
  ON_COMPONENT_BEFORE_DESTROY: 'onComponentBeforeDestroy',
  ON_COMPONENT_DESTROYED: 'onComponentDestroyed',
}

export {
  BootEvent,
  GeolocationEvent,
  PermissionEvent,
  ComponentEvent,
}
