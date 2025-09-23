const db = new Promise(function (resolve, reject) {
  const DBOpenRequest = window.indexedDB.open('crosswords', 1)
  DBOpenRequest.onerror = function (event) {
    reject(new Error('Error loading database'))
  }
  DBOpenRequest.onsuccess = (event) => {
    resolve(DBOpenRequest.result)
  }
  DBOpenRequest.onupgradeneeded = (event) => {
    const db = event.target.result
    const objectStore = db.createObjectStore('crosswords', { keyPath: 'id' })
  }
})

function p (request) {
  return new Promise(function (resolve, reject) {
    request.onsuccess = resolve
    request.onerror = reject
  })
}
