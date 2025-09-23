window.addEventListener('load', function () {
  function extractData (json) {
    const data = JSON.parse(json)
    return {
      id: data.id.toString(),
      constructors: data.constructors,
      editor: data.editor,
      publicationDate: data.publicationDate,
      body: [{
        cells: data.body[0].cells,
        clues: data.body[0].clues,
        clueLists: data.body[0].clueLists,
        dimensions: data.body[0].dimensions
      }]
    }
  }

  function readFile (file) {
    return new Promise(function (resolve, reject) {
      const reader = new FileReader()
      reader.addEventListener('load', function () {
        try {
          const data = extractData(reader.result)
          resolve(data)
        } catch (e) {
          reject('Failed to load file')
        }
      })
      reader.readAsText(file)
    })
  }

  async function saveFile (file) {
    const data = await readFile(file)
    const store = (await db).transaction(['crosswords'], 'readwrite').objectStore('crosswords')
    await p(store.put(data))
    return data
  }

  document.getElementById('form').addEventListener('submit', async function (event) {
    event.preventDefault()

    const file = this.file.files[0]
    if (file) {
      const data = await saveFile(file)
      location.href = `puzzle/?id=${data.id}`
    }
  })
})
