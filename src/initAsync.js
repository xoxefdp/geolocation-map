import networkMonitor from 'systems/network/monitor'

export default function() {
  const asyncReturn = new Promise(
    (resolve, reject) => {
      // MONITORS
      networkMonitor.initializeMonitor()
      resolve()
    }
  )

  return asyncReturn
}
