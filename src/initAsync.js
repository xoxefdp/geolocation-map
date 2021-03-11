import { isPermissionsSupported } from 'permissions/permissions'
import { initGeoService } from 'geolocation/geolocation'

const initAsync = () => {
  return new Promise(
    (resolve, reject) => {
      // INIT ANY MODULE BEFORE RENDER HERE
      isPermissionsSupported
        ? initGeoService()
          .then((permissionStatus) => {
            resolve(permissionStatus)
          })
          .catch((error) => {
            reject(error)
          })
        : reject(new Error('Web APIs not supported'))
    })
}

export default initAsync
