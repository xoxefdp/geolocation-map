import { isPermissionsSupported } from 'permissions/permissions'
import { initGeoService } from 'geolocation/geolocation'
import { WebAPIError } from 'systems/Constants'

const initAsync = () => {
  return new Promise(
    (resolve, reject) => {
      isPermissionsSupported()
        ? initGeoService()
          .then(() => {
            resolve()
          })
          .catch((error) => {
            reject(error)
          })
        : reject(new Error(WebAPIError.PERMISSIONS_NOT_SUPPORTED))
    })
}

export default initAsync
