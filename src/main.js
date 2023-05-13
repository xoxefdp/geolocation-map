import initAsync from 'initAsync'
import { createUI } from 'systems/bootUI'

const ID = 'main'

initAsync().finally(
  () => {
    DEBUG && console.log(ID, 'initAsync()')
    createUI()
  }
)
