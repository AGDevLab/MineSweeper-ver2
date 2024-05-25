'use strict'

// In Progress, Limited functionality

var gBoard, numOfNegMines, mine, gIsWinner

const MINE = '⊛'
const MARK = '🏳️'
const EMPTY = '▢'
const SMILEY = ['😑', '😵', '😎']

// const MARK = '<img src="assets/img/flag.png"/>'
// ⁜※⁐▢▣◌●◯■◻■🏳️🏴🚩□■ŐÕŎʘ▢◌◍◉⊛⊘⊕⊗⨂

const gLevel = {
  size: 4,
  mines: 2,
}

var gGame = {
  isOn: false,
  firstTurn: true,
  shownCount: 0,
  markedCount: 0,
  secsPassed: 0,
  lives: 3,
  minesHit: 0,
}

/* The Model:

gBoard – A Matrix
containing cell objects:
Each cell: {
 minesAroundCount: 4,
 isShown: false,
 isMine: false,
 isMarked: true
}
*/

/*
This is an object by which the
board size is set (in this case:
4x4 board and how many mines
to place)

gLevel = {
 SIZE: 4,
 MINES: 2
}
*/

/*
This is an object in which you
can keep and update the
current game state:
isOn: Boolean, when true we
let the user play
shownCount: How many cells
are shown
markedCount: How many cells
are marked (with a flag)
secsPassed: How many seconds
passed 

gGame = {
 isOn: false,
 shownCount: 0,
 markedCount: 0,
 secsPassed: 0
}
*/

// This is called when page loads
function onInit() {
  gBoard = buildBoard()
  console.log('gBoard', gBoard)
  renderBoard(gBoard)
  // console.log(document.querySelector('h2 .smiley').innerText)
  resetGameState()
}

function resetGameState() {
  if (gGame.firstTurn) {
    console.log('firstTurnState')
    gGame.lives = 3
    document.querySelector('h2 span').innerText = gGame.lives
    gGame.markedCount = 0
    gGame.shownCount = 0
    gGame.minesHit = 0
    gGame.firstTurn = true
    document.querySelector('h2 .smiley').innerText = SMILEY[0]
    // clearInterval(intervalId)
    // intervalId = null
    // (gameBoardSize = 4), // Dynamic boardsize working
    // (gameBoardFull = gameBoardSize ** 2),
    // (timeCounter = 0),
    // (counterElement.textContent = timeCounter)
  }
}

// Builds the board Set the mines Call setMinesNegsCount() Return the created board
// step1.1 done
function buildBoard() {
  const board = createMat(gLevel.size, gLevel.size)
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[0].length; j++) {
      board[i][j] = {
        minesAroundCount: numOfNegMines,
        isShown: false,
        isMine: false,
        isMarked: false,
      }
    }
  }
  // if (gGame.firstTurn) {
  //   console.log('gGame.firstTurn')
  //   firstClickTurn(board, gLevel.mines)
  // }
  // console.log(gGame.firstTurn)

  // addMine(board, gLevel.mines)

  return board
}

function firstClickTurn(board, mineCount, cellI, cellJ) {
  // console.log(gBoard[cellI][cellJ].isShown)
  // gBoard[cellI][cellJ].isShown = true
  if (gGame.shownCount > 0) {
    // console.log('entered loop')
    // console.log('gGame.shownCount', gGame.shownCount)
    addMine(board, mineCount)
    gGame.firstTurn = false
    renderBoard(board)
    // return firstTurn
  } else {
    console.log(gBoard[cellI][cellJ])
    gBoard[cellI][cellJ].isShown = true
    // console.log(gBoard[cellI][cellJ].isShown)
    // console.log('firstTurnElse')
    gGame.shownCount++
  }
}

// step1.3 done
function renderBoard(board) {
  var strHTML = ''
  for (var i = 0; i < board.length; i++) {
    strHTML += '<tr>'
    for (var j = 0; j < board[0].length; j++) {
      const currCell = board[i][j]

      numOfNegMines = setMinesNegsCount(i, j, board)
      currCell.minesAroundCount = numOfNegMines
      const tdId = `cell-${i}-${j}`

      var cellClass = getClassName({ i: i, j: j }) // cell-i-j

      if (currCell.isMine) cellClass += ' mine'
      // else if (currCell.type === WALL) cellClass += ' wall'

      strHTML += `<td id="${tdId}" class="cell ${cellClass}" onclick="onCellClicked(this,${i},${j})" oncontextmenu="onCellMarked(event, this); return false;"><span class="hidden">`

      if (currCell.isMine) {
        strHTML += MINE
      } else if (!currCell.mine && currCell.minesAroundCount === 0) {
        // console.log('empty')
        strHTML += EMPTY
      } else if (!currCell.mine && currCell.minesAroundCount) {
        strHTML += currCell.minesAroundCount
      } else if (currCell.isShown) {
        console.log('firstTurnTest')
        strHTML += EMPTY
      } else if (!currCell.mine) {
        strHTML += EMPTY
      }

      strHTML += '</span></td>'
    }
    strHTML += '</tr>'
  }

  const elBoard = document.querySelector('.board')
  elBoard.innerHTML = strHTML
}

// Returns the class name for a specific cell
function getClassName(location) {
  const cellClass = 'cell-' + location.i + '-' + location.j
  return cellClass
} // step1.3 done

// Called when a cell is clicked
function onCellClicked(elCell, cellI, cellJ) {
  if (checkGameOver()) return
  // console.log(gIsWinner)
  var clickedCell = gBoard[cellI][cellJ]
  var cellSpan = elCell.querySelector('span')
  if (!cellSpan || clickedCell.isMarked) {
    return
  }

  if (!clickedCell.isMine) {
    if (clickedCell.minesAroundCount > 0) {
      // console.log('numedCellTest')
      if (cellSpan.classList.contains('hidden')) {
        // console.log(cellSpan.textContent)
        cellSpan.classList.remove('hidden')
        cellSpan.classList.add('marked')
        clickedCell.isShown = true
        gGame.shownCount++
      }
    }
    for (var i = cellI - 1; i <= cellI + 1; i++) {
      if (i < 0 || i >= gBoard.length) continue
      for (var j = cellJ - 1; j <= cellJ + 1; j++) {
        if (j < 0 || j >= gBoard[i].length) continue
        // if (i === cellI && j === cellJ) continue

        var neighborCell = gBoard[i][j]
        var neighborCellEl = document.querySelector(`.cell-${i}-${j}`)
        var neighborCellSpan = neighborCellEl
          ? neighborCellEl.querySelector('span')
          : null

        if (clickedCell.minesAroundCount === 0) {
          //   console.log('emptyCellTest')
          if (
            neighborCellSpan &&
            neighborCellSpan.classList.contains('hidden')
          ) {
            neighborCellSpan.classList.remove('hidden')
            neighborCellSpan.classList.add('marked')
            neighborCell.isShown = true
            if (gGame.firstTurn) {
              // console.log('gGame.firstTurn')
              firstClickTurn(gBoard, gLevel.mines, cellI, cellJ)
            } else {
              gGame.shownCount++
            }
          }
        }
      }
    }
  }
  // console.log(clickedCell)

  if (clickedCell.isMine && !clickedCell.isShown) {
    clickedCell.isShown = true
    console.log('mine')
    gGame.minesHit++

    gGame.lives--
    document.querySelector('h2 span').innerText = gGame.lives
    cellSpan.classList.remove('hidden')
    cellSpan.classList.add('marked')
    // document.querySelector('h2 span').innerText = `${'Game Over'}`
  }
}

// Called when a cell is rightclicked See how you can hide the context menu on right click
function onCellMarked(event, elCell) {
  event.preventDefault()
  console.log(elCell)

  const cellCoord = getCellCoord(elCell.id)
  var currCell = gBoard[cellCoord.i][cellCoord.j]
  var elSpan = elCell.querySelector('span')
  // console.log(+elSpan.innerHTML)
  // console.log(elSpan.innerHTML)
  // console.log(elSpan.textContent)
  // console.log(elCell.innerHTML)
  // console.log(elCell.textContent)

  if (!currCell.isShown) {
    // console.log('Cell innerText before marking:', elCell.innerText)

    if (!currCell.isMarked) {
      if (gGame.markedCount < 4) {
        currCell.isMarked = true
        console.log('marked', elSpan, gBoard[cellCoord.i][cellCoord.j])
        // elSpan.textContent = 'M'
        console.log(elSpan)
        elSpan.innerHTML = markFlagHTML()
        elSpan.classList.remove('hidden')
        console.log(elSpan)

        gGame.markedCount++
      }
    } else {
      currCell.isMarked = false
      currCell.minesAroundCount
        ? (elSpan.textContent = currCell.minesAroundCount)
        : (elSpan.textContent = EMPTY)
      elSpan.classList.add('hidden')

      console.log('unmarked', elSpan, gBoard[cellCoord.i][cellCoord.j])
      gGame.markedCount--
    }
  }
}

// TODO: Game ends when all mines are marked, and all the other cells are shown
function checkGameOver() {
  var gameOver = null

  var winningState = gLevel.size ** 2 - gLevel.mines
  // console.log(winningState)
  // console.log(gGame.shownCount)

  if (gGame.lives === 0) {
    gameOver = true
    document.querySelector('h2 .smiley').innerText = SMILEY[1]
  } else if (gGame.shownCount === winningState) {
    gIsWinner = true
    gameOver = true
    document.querySelector('h2 .smiley').innerText = SMILEY[2]
  }
  return gameOver
}

/*
When user clicks a cell with no mines around, we need to open not only that cell, but also its
neighbors. NOTE: start with a basic implementation that only opens the non-mine 1st degree
neighbors.
BONUS: if you have the time later, try to work more like the real algorithm (see description
at the Bonuses section below)
*/
// TODO:
function expandShown(board, elCell, i, j) {}

function resetGame() {
  console.log('resetGame')
  gGame.shownCount = 0
  gGame.firstTurn = true
  onInit()

  // gCurrQuestIdx = 0
  // document.querySelector('.button1').classList.remove('hidden')
  // document.querySelector('.button2').classList.remove('hidden')
  // onInit()
  // document.querySelector('.restartBtn').style.display = 'none'
  // window.location.reload()
}

function markFlagHTML() {
  return `<div>${MARK}</div>`
}
