import { isPermissionsSupported } from 'permissions/permissions'
import { initGeoService } from 'geolocation/geolocation'
import { setInitialPosition } from 'geolocation/store'
import { WebAPIError } from 'systems/Constants'

const initAsync = () => {
  return new Promise(
    (resolve, reject) => {
      let promiseGeo

      if (isPermissionsSupported()) {
        promiseGeo = initGeoService()
      } else {
        promiseGeo = Promise.reject(new Error(WebAPIError.PERMISSIONS_NOT_SUPPORTED))
      }

      const promiseFetch = fetch('/api/init')
        .then(response => response.json())
        .then((data) => {
          const position = {
            coords: {
              accuracy: null,
              altitude: null,
              altitudeAccuracy: null,
              heading: null,
              latitude: data.latitude,
              longitude: data.longitude,
              speed: null,
            },
            timestamp: Date.now(),
          }
          setInitialPosition(position)
        })

      const allPromise = [promiseGeo, promiseFetch]

      Promise.allSettled(allPromise)
        .then(() => {
          resolve()
        })
    })
}

export default initAsync
