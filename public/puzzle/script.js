const DIRECTIONS = {
  ACROSS: 'Across',
  DOWN: 'Down'
}

function formatList (list) {
  if (list.length > 2) {
    return list.slice(0, -1).join(', ') + ', & ' + list[list.length - 1]
  } else if (list.length > 1) {
    return list.join(' & ')
  } else {
    return list[0]
  }
}

function createSvgElement (tag, attributes) {
  const element = document.createElementNS('http://www.w3.org/2000/svg', tag)
  for (const key in attributes) {
    element.setAttribute(key, attributes[key])
  }
  return element
}

function createSvg (board) {
  const cellSize = 100
  const frameSize = 3
  const width = board.dimensions.width * cellSize + 2 * frameSize
  const height = board.dimensions.height * cellSize + 2 * frameSize

  const $svg = createSvgElement('svg', {
    xmlns: 'http://www.w3.org/2000/svg',
    'xmlns:xlink': 'http://www.w3.org/1999/xlink',
    viewBox: `${-frameSize} ${-frameSize} ${width} ${height}`
  })

  const $cells = createSvgElement('g', { class: 'cells' })
  for (let i = 0; i < board.cells.length; i++) {
    const x = i % board.dimensions.width
    const y = (i - x) / board.dimensions.width
    const $g = createSvgElement('g', { 'data-index': i })
    const $rect = createSvgElement('rect', {
      x: x * cellSize,
      y: y * cellSize,
      width: cellSize,
      height: cellSize,
      fill: board.cells[i].type === 1 ? 'none' : '#000000',
      stroke: '#666666'
    })
    $g.appendChild($rect)

    if (board.cells[i].label) {
      const $text = createSvgElement('text', {
        x: x * cellSize + 4,
        y: y * cellSize + 28,
        'font-size': 28
      })
      $text.textContent = board.cells[i].label
      $g.appendChild($text)
    }

    const $text = createSvgElement('text', {
      class: 'guess',
      x: x * cellSize + 0.5 * cellSize,
      y: y * cellSize + cellSize - 18,
      'font-size': 72,
      'text-anchor': 'middle'
    })
    $g.appendChild($text)

    $cells.appendChild($g)
  }
  $svg.appendChild($cells)

  const $frame = createSvgElement('rect', {
    x: -0.5 * frameSize,
    y: -0.5 * frameSize,
    width: board.dimensions.width * cellSize + frameSize,
    height: board.dimensions.height * cellSize + frameSize,
    fill: 'none',
    stroke: 'black',
    'stroke-width': frameSize
  })
  $svg.appendChild($frame)

  return $svg
}

function getFocus (focus, board) {
  const cell = board.cells[focus.cell]
  const clue = cell.clues
  .map(clue => board.clues[clue])
  .find(clue => clue.direction === focus.direction)

  return { cell, clue }
}

function applyFocus (focus, board) {
  for (const element of document.querySelectorAll('g[data-index].focus')) {
    element.classList.remove('focus')
  }
  for (const element of document.querySelectorAll('g[data-index].active, #clues li.active')) {
    element.classList.remove('active')
  }

  const { cell, clue } = getFocus(focus, board)

  cell.$g.classList.add('focus')
  clue.$li.classList.add('active')
  for (const clueCell of clue.cells) {
    board.cells[clueCell].$g.classList.add('active')
  }
}

function moveFocus (focus, board, { forward, loop, checkGuesses }) {
  const { cell, clue } = getFocus(focus, board)
  const complete = isClueComplete(clue, board)
  let i = clue.cells.indexOf(focus.cell)

  if (!loop && (forward ? i === clue.cells.length - 1 : i === 0)) {
    return
  }

  do {
    i = forward ? i + 1 : i - 1
    i = (i + clue.cells.length) % clue.cells.length
  } while (checkGuesses && !complete && board.guesses[clue.cells[i]] !== null)

  focus.cell = clue.cells[i]
}

function isClueComplete (clue, board) {
  return clue.cells.every(cell => board.guesses[cell] !== null)
}

function isPuzzleComplete (board) {
  return board.cells.every((cell, i) => cell.type !== 1 || board.guesses[i] !== null)
}

function isPuzzleCorrect (board) {
  return board.cells.every((cell, i) => cell.type !== 1 || board.guesses[i] === cell.answer)
}

function formatDate (date) {
  const dateFormatter = new Intl.DateTimeFormat('en', {
    dateStyle: 'full'
  })
  return dateFormatter.format(new Date(date))
}

function formatTime (duration) {
  const minutes = Math.floor(duration / 60).toString()
  const seconds = (duration % 60).toString().padStart(2, '0')

  return `${minutes}:${seconds}`
}

function generateWinningImage (data, timing) {
  const duration = Math.floor((timing.endTime - timing.startTime) / 1000)
  const text = 'I finished this crossword in'
  const time = duration < 60 ? `${duration} seconds` : formatTime(duration)
  const title = formatDate(data.publicationDate)

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 300 150" width="1200px" height="600px" style="font-family: Cambria, serif;">
    <rect x="0" y="0" width="300" height="150" fill="#FAE8C7"/>

    <rect x="270" y="0" width="30" height="30" fill="#FDAA45"/>
    <rect x="0" y="90" width="30" height="30" fill="#FDAA45"/>
    <rect x="0" y="120" width="30" height="30" fill="#FDAA45"/>
    <rect x="30" y="120" width="30" height="30" fill="#FDAA45"/>
    <rect x="270" y="90" width="30" height="30" fill="#FDAA45"/>
    <rect x="270" y="120" width="30" height="30" fill="#FDAA45"/>

    <line x1="0" x2="300" y1="30" y2="30" stroke="#FDAA45"/>
    <line x1="0" x2="300" y1="60" y2="60" stroke="#FDAA45"/>
    <line x1="0" x2="300" y1="90" y2="90" stroke="#FDAA45"/>
    <line x1="0" x2="300" y1="120" y2="120" stroke="#FDAA45"/>
    <line x1="30" x2="30" y1="0" y2="150" stroke="#FDAA45"/>
    <line x1="60" x2="60" y1="0" y2="150" stroke="#FDAA45"/>
    <line x1="90" x2="90" y1="0" y2="150" stroke="#FDAA45"/>
    <line x1="120" x2="120" y1="0" y2="150" stroke="#FDAA45"/>
    <line x1="150" x2="150" y1="0" y2="150" stroke="#FDAA45"/>
    <line x1="180" x2="180" y1="0" y2="150" stroke="#FDAA45"/>
    <line x1="210" x2="210" y1="0" y2="150" stroke="#FDAA45"/>
    <line x1="240" x2="240" y1="0" y2="150" stroke="#FDAA45"/>
    <line x1="270" x2="270" y1="0" y2="150" stroke="#FDAA45"/>

    <text x="150" y="52" text-anchor="middle" font-size="20">${text}</text>
    <text x="150" y="85" text-anchor="middle" font-size="30" font-weight="bold">${time}</text>
    <text x="150" y="112" text-anchor="middle" font-size="20">${title}</text>
  </svg>`

  return {
    src: 'data:image/svg+xml;base64,' + btoa(svg),
    alt: `${text} ${time} on ${title}`
  }
}

async function main () {
  const params = new URLSearchParams(document.location.search)
  const id = params.get('id')
  const store = (await db).transaction(['crosswords'], 'readwrite').objectStore('crosswords')
  const data = (await p(store.get(id))).target.result

  const board = data.body[0]

  // Load interface
  document.getElementById('title').textContent = formatDate(data.publicationDate)
  document.getElementById('byline').textContent = `By ${formatList(data.constructors)}, edited by ${data.editor}`
  const $svg = createSvg(board)
  const dimensions = $svg.getAttribute('viewBox').split(' ')
  $svg.setAttribute('width', (dimensions[2] - dimensions[0]) + 'px')
  $svg.setAttribute('height', (dimensions[3] - dimensions[1]) + 'px')
  document.getElementById('crossword-board').append($svg)

  for (const $cell of document.querySelectorAll('g[data-index]')) {
    board.cells[$cell.dataset.index].$g = $cell
  }

  for (const list of board.clueLists) {
    const $h3 = document.createElement('h3')
    $h3.textContent = list.name
    const $ul = document.createElement('ul')

    for (const clueIndex of list.clues) {
      const clue = board.clues[clueIndex]
      const $li = document.createElement('li')
      $li.textContent = `${clue.text.map(item => item.plain).join(' ')}`
      $li.setAttribute('data-clue', clueIndex)
      $li.setAttribute('data-label', clue.label)
      $ul.appendChild($li)
      clue.$li = $li
    }

    document.getElementById('clues').append($h3, $ul)
  }

  // Setup game state
  board.guesses = Array(board.cells.length).fill(null)
  const timing = {}
  const focus = {
    cell: board.clues[0].cells[0],
    direction: board.clues[0].direction
  }
  let filled = false

  // Event listeners
  window.addEventListener('keydown', function (event) {
    if (!document.querySelector('g[data-index].focus')) {
      return
    }

    if (event.key === 'Backspace') {
      board.guesses[focus.cell] = null
      board.cells[focus.cell].$g.querySelector('.guess').textContent = ''
      for (const clue of board.cells[focus.cell].clues) {
        board.clues[clue].$li.classList.remove('complete')
      }
      filled = false
      moveFocus(focus, board, { forward: false, loop: false, checkGuesses: false })
    } else if (event.key === 'Enter') {
      const { clue } = getFocus(focus, board)
      const i = board.clues.indexOf(clue)
      const nextClue = board.clues[(i + 1) % board.clues.length]
      focus.cell = nextClue.cells[0]
      focus.direction = nextClue.direction
    } else if ((event.key === 'ArrowDown' || event.key === 'ArrowUp') && focus.direction === DIRECTIONS.ACROSS) {
      focus.direction = DIRECTIONS.DOWN
    } else if ((event.key === 'ArrowRight' || event.key === 'ArrowLeft') && focus.direction === DIRECTIONS.DOWN) {
      focus.direction = DIRECTIONS.ACROSS
    } else if (event.key.startsWith('Arrow')) {
      moveFocus(focus, board, {
        forward: event.key === 'ArrowDown' || event.key === 'ArrowRight',
        loop: true,
        checkGuesses: false
      })
    } else if (event.key.length === 1 && !event.ctrlKey && !event.altKey && !event.metaKey && !timing.endTime) {
      const guess = event.key.toUpperCase()
      board.guesses[focus.cell] = guess
      board.cells[focus.cell].$g.querySelector('.guess').textContent = guess

      for (const clue of board.cells[focus.cell].clues) {
        if (isClueComplete(board.clues[clue], board)) {
          board.clues[clue].$li.classList.add('complete')
        }
      }

      if (isPuzzleCorrect(board)) {
        timing.endTime = Date.now()
        clearInterval(timing.timer)
        const $img = document.getElementById('dialog_finish_image')
        const image = generateWinningImage(data, timing)
        $img.setAttribute('src', image.src)
        $img.setAttribute('alt', image.alt)

        document.getElementById('dialog_finish_share').addEventListener('click', function () {
          const svg = atob(image.src.split(',')[1])
          const buffer = new Uint8Array(svg.length)
          for (let i = 0; i < svg.length; i++) {
            buffer[i] = svg.charCodeAt(i)
          }
          const imageFile = new File([buffer], 'crossword.svg', { type: 'image/svg+xml' })

          const shareData = {
            text: image.alt,
            url: location.href,
            files: [imageFile]
          }

          try {
            if (navigator.canShare(shareData)) {
              navigator.share(shareData)
            }
          } catch (err) {}
        })

        document.getElementById('dialog_finish').showModal()
      } else if (isPuzzleComplete(board)) {
        if (!filled) {
          document.getElementById('dialog_incorrect').showModal()
          filled = true
        }
      }

      const { clue } = getFocus(focus, board)
      if (!isClueComplete(clue, board)) {
        moveFocus(focus, board, { forward: true, loop: true, checkGuesses: true })
      }
    }

    applyFocus(focus, board)
  })

  function handleClick (event) {
    const $g = event.target.closest('g[data-index]')
    const cell = parseInt($g.dataset.index)
    if (cell === focus.cell) {
      focus.direction = focus.direction === DIRECTIONS.DOWN ? DIRECTIONS.ACROSS : DIRECTIONS.DOWN
    } else {
      focus.cell = cell
      const clues = board.cells[focus.cell].clues.map(clue => board.clues[clue])
      if (clues.length === 1) {
        focus.direction = clues[0].direction
      }
    }
    applyFocus(focus, board)
  }

  for (const cell of board.cells) {
    cell.$g.addEventListener('click', handleClick)
  }

  document.getElementById('dialog_start').addEventListener('close', function () {
    timing.startTime = Date.now()
    timing.timer = setInterval(function () {
      const duration = Math.floor((Date.now() - timing.startTime) / 1000)
      document.getElementById('timer').textContent = formatTime(duration)
    }, 1000)

    applyFocus(focus, board)
  })

  document.getElementById('dialog_start').showModal()
}

window.addEventListener('load', main)
