import { isPermissionsSupported } from 'permissions/permissions'
import { initGeoService } from 'geolocation/geolocation'
import { setInitialPosition } from 'geolocation/store'
import { WebAPIError } from 'systems/Constants'

const initAsync = () => {
  return new Promise(
    (resolve, reject) => {
      let promiseGeo

      const position = {
        coords: {
          accuracy: null,
          altitude: null,
          altitudeAccuracy: null,
          heading: null,
          latitude: null,
          longitude: null,
          speed: null,
        },
        timestamp: null,
      }

      if (isPermissionsSupported()) {
        promiseGeo = initGeoService()
      } else {
        promiseGeo = Promise.reject(new Error(WebAPIError.PERMISSIONS_NOT_SUPPORTED))
      }

      const promiseFetch = fetch('/home')
        .then(response => response.json())
        .then((data) => {
          position.coords.latitude = data.latitude
          position.coords.longitude = data.longitude
          position.timestamp = Date.now()
        }).catch((_error) => {
          position.coords.latitude = 38.8445
          position.coords.longitude = 0.1115
        })

      const allPromise = [promiseGeo, promiseFetch]

      Promise.allSettled(allPromise)
        .then((results) => {
          console.log(results)
          setInitialPosition(position)
          resolve()
        })
    })
}

export default initAsync
