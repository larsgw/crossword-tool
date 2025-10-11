const db = new Promise(function (resolve, reject) {
  const DBOpenRequest = window.indexedDB.open('crosswords', 2)
  DBOpenRequest.onerror = function (event) {
    reject(new Error('Error loading database'))
  }
  DBOpenRequest.onsuccess = (event) => {
    resolve(DBOpenRequest.result)
  }
  DBOpenRequest.onupgradeneeded = (event) => {
    const db = event.target.result

    if (!db.objectStoreNames.contains('crosswords')) {
      db.createObjectStore('crosswords', { keyPath: 'id' })
    }

    if (!db.objectStoreNames.contains('scores')) {
      db.createObjectStore('scores', { keyPath: 'id' })
    }
  }
})

function p (request) {
  return new Promise(function (resolve, reject) {
    request.onsuccess = resolve
    request.onerror = reject
  })
}
