import initAsync from 'initAsync'
import { createUI } from 'systems/bootUI'

const ID = 'main'

initAsync().finally(
  () => {
    console.debug(ID, 'initAsync()')
    createUI()
  }
)
