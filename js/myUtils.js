function countNegs(cellI, cellJ, mat) {
  // 7,0
  var negsCount = 0
  for (var i = cellI - 1; i <= cellI + 1; i++) {
    if (i < 0 || i >= mat.length) continue
    for (var j = cellJ - 1; j <= cellJ + 1; j++) {
      if (j < 0 || j >= mat[i].length) continue
      if (i === cellI && j === cellJ) continue

      if (mat[i][j] === LIFE) negsCount++
    }
  }
  return negsCount
}

function createBoard() {
  var board = []
  for (var i = 0; i < 8; i++) {
    board.push([])
    for (var j = 0; j < 8; j++) {
      board[i][j] = Math.random() > 0.5 ? LIFE : ''
    }
  }
  return board
}

function buildBoard() {
  // Create the Matrix 10 * 12
  const board = createMat(10, 12)
  // Put FLOOR everywhere and WALL at edges
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[0].length; j++) {
      board[i][j] = { type: FLOOR, gameElement: null }
      if (
        i === 0 ||
        i === board.length - 1 ||
        j === 0 ||
        j === board[0].length - 1
      ) {
        board[i][j].type = WALL
      }
    }
  }

  // Place the gamer and two balls
  board[gGamerPos.i][gGamerPos.j].gameElement = GAMER

  board[2][4].gameElement = BALL
  board[7][6].gameElement = BALL

  console.log(board)
  return board
}

// Render the board to an HTML table
function renderBoard(board) {
  var strHTML = ''
  for (var i = 0; i < board.length; i++) {
    strHTML += '<tr>'
    for (var j = 0; j < board[0].length; j++) {
      const currCell = board[i][j] // {type,gameElement}

      var cellClass = getClassName({ i: i, j: j }) // 'cell-0-0'

      if (currCell.type === FLOOR) cellClass += ' floor' // 'cell-0-0 floor'
      else if (currCell.type === WALL) cellClass += ' wall' // 'cell-0-0 wall'

      strHTML +=
        '<td class="cell ' +
        cellClass +
        '"  onclick="moveTo(' +
        i +
        ',' +
        j +
        ')" >'

      if (currCell.gameElement === GAMER) {
        strHTML += GAMER_IMG
      } else if (currCell.gameElement === BALL) {
        strHTML += BALL_IMG
      }

      strHTML += '</td>'
    }
    strHTML += '</tr>'
  }

  const elBoard = document.querySelector('.board')
  elBoard.innerHTML = strHTML
}

// Move the player to a specific location
function moveTo(i, j) {
  console.log('i, j:', i, j)

  const targetCell = gBoard[i][j]
  if (targetCell.type === WALL) return

  // Calculate distance to make sure we are moving to a neighbor cell
  const iAbsDiff = Math.abs(i - gGamerPos.i) // 1 ,2..
  const jAbsDiff = Math.abs(j - gGamerPos.j) // 1 ,7...

  // If the clicked Cell is one of the four allowed
  if (
    (iAbsDiff === 1 && jAbsDiff === 0) ||
    (jAbsDiff === 1 && iAbsDiff === 0)
  ) {
    console.log('MOVE')
    if (targetCell.gameElement === BALL) {
      console.log('Collecting!')
    }

    // Move the gamer
    // Moving from current position:
    // Model:
    gBoard[gGamerPos.i][gGamerPos.j].gameElement = null

    // Dom:
    renderCell(gGamerPos, '')

    // Moving to selected position:
    // Model:
    gBoard[i][j].gameElement = GAMER
    gGamerPos.i = i
    gGamerPos.j = j

    // Dom:
    renderCell(gGamerPos, GAMER_IMG)
  } else console.log('TOO FAR', iAbsDiff, jAbsDiff)
}

// Convert a location object {i, j} to a selector and render a value in that element
function renderCell(location, value) {
  const cellSelector = '.' + getClassName(location)
  const elCell = document.querySelector(cellSelector)
  elCell.innerHTML = value
}

// Move the player by keyboard arrows
function onHandleKey(event) {
  // console.log('event:', event)
  const i = gGamerPos.i // 2
  const j = gGamerPos.j // 9

  switch (event.key) {
    case 'ArrowLeft':
      moveTo(i, j - 1)
      break
    case 'ArrowRight':
      moveTo(i, j + 1)
      break
    case 'ArrowUp':
      moveTo(i - 1, j)
      break
    case 'ArrowDown':
      moveTo(i + 1, j)
      break
  }
}

// Returns the class name for a specific cell
function getClassName(location) {
  // {i:2,j:4}
  const cellClass = `cell-${location.i}-${location.j}` // 'cell-2-4'
  return cellClass
}

// ----- chess

function cellClicked(elCell) {
  // console.log('elCell:', elCell)

  // if the target is marked - move the piece!

  if (elCell.classList.contains('mark')) {
    // console.log('move')
    movePiece(gSelectedElCell, elCell)
    cleanBoard()
    return
  }

  cleanBoard()

  elCell.classList.add('selected')

  // Saving in a global variable
  gSelectedElCell = elCell

  // console.log('elCell.id:', elCell.id) // 'cell-1-2'
  const cellCoord = getCellCoord(elCell.id) // {i:1,j:2}
  const piece = gBoard[cellCoord.i][cellCoord.j]
  console.log('piece:', piece)
  // Another way
  // const piece = elCell.innerText

  var possibleCoords = []
  switch (piece) {
    case ROOK_BLACK:
    case ROOK_WHITE:
      possibleCoords = getAllPossibleCoordsRook(cellCoord)
      break
    case BISHOP_BLACK:
    case BISHOP_WHITE:
      possibleCoords = getAllPossibleCoordsBishop(cellCoord)
      break
    case KNIGHT_BLACK:
    case KNIGHT_WHITE:
      possibleCoords = getAllPossibleCoordsKnight(cellCoord)
      break
    case PAWN_BLACK:
    case PAWN_WHITE:
      possibleCoords = getEmptyNegsAround(cellCoord, piece === PAWN_WHITE)
      break
  }
  markCells(possibleCoords)
}

function cleanBoard() {
  const elTds = document.querySelectorAll('.mark, .selected')
  for (var i = 0; i < elTds.length; i++) {
    elTds[i].classList.remove('mark', 'selected')
  }
}

function getSelector(coord) {
  return `#cell-${coord.i}-${coord.j}`
}

function isEmptyCell(coord) {
  // return gBoard[coord.i][coord.j]  === ''
  return !gBoard[coord.i][coord.j]
}

function getEmptyNegsAround(pieceCoord, isWhite) {
  // handle PAWN use isEmptyCell()
  // var res = [{i:2,j:0},{i:3,j:0}]
  var res = []

  var diff = isWhite ? -1 : 1
  var nextCoord = { i: pieceCoord.i + diff, j: pieceCoord.j }
  if (isEmptyCell(nextCoord)) res.push(nextCoord)
  else return res

  if ((!isWhite && pieceCoord.i === 1) || (isWhite && pieceCoord.i === 6)) {
    diff *= 2
    nextCoord = { i: pieceCoord.i + diff, j: pieceCoord.j }
    if (isEmptyCell(nextCoord)) res.push(nextCoord)
  }

  return res
}

// ----------

function cellClicked(elCell, cellI, cellJ) {
  // console.log('elCell:', elCell)
  // if (elCell.innerText === LIFE) {
  // if (elCell.classList.contains('occupied')) {
  if (gBoard[cellI][cellJ] === LIFE) {
    // Update the Model:
    gBoard[cellI][cellJ] = SUPER_LIFE

    // Update the Dom:
    elCell.innerText = SUPER_LIFE

    blowUpNegs(cellI, cellJ)
  }
}

function chooseLevelSize(elBtn) {
  // console.log('elBtn.dataset:', elBtn.dataset)
  var size = +elBtn.dataset.size
  // console.log('size:', size)
  gSize = size
  onInit()
}

function copyMat(mat) {
  var newMat = []
  for (var i = 0; i < mat.length; i++) {
    newMat[i] = []
    for (var j = 0; j < mat[0].length; j++) {
      newMat[i][j] = mat[i][j]
    }
  }
  return newMat
}

function createMat(ROWS, COLS) {
  const mat = []
  for (var i = 0; i < ROWS; i++) {
    const row = []
    for (var j = 0; j < COLS; j++) {
      row.push('')
    }
    mat.push(row)
  }
  return mat
}

// Gets a string such as:  'cell-2-7' and returns {i:2, j:7}
function getCellCoord(strCellId) {
  const coord = {}
  const parts = strCellId.split('-') // ['cell','2','7']
  coord.i = +parts[1]
  coord.j = +parts[2]
  return coord
}
