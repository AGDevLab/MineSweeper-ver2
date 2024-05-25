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

function getRandomIntInclusive(min, max) {
  const minCeiled = Math.ceil(min)
  const maxFloored = Math.floor(max)
  return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled) // The maximum is inclusive and the minimum is inclusive
}

function getRandomInt(min, max) {
  const minCeiled = Math.ceil(min)
  const maxFloored = Math.floor(max)
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled) // The maximum is exclusive and the minimum is inclusive
}

// Convert a location object {i, j} to a selector and render a value in that element
function renderCell(location, value) {
  const cellSelector = '.' + getClassName(location) // '.cell-1-1'
  const elCell = document.querySelector(cellSelector) // <td></td>
  elCell.innerHTML = value
} // to be used later

// Gets a string such as:  'cell-2-7' and returns {i:2, j:7}
function getCellCoord(strCellId) {
  const coord = {}
  const parts = strCellId.split('-') // ['cell','2','7']
  coord.i = +parts[1]
  coord.j = +parts[2]
  return coord
}

function difficultyBtnChecker(btn) {
  var tempSize = btn.getAttribute('data-boardSize')
  var tempDiff = btn.getAttribute('data-mines')
  console.log(btn.getAttribute('data-mines'))
  console.log(tempSize)
  console.log(tempDiff)
  gLevel.size = tempSize
  gLevel.mines = tempDiff

  // gameBoardSize = tempSize
  // gameBoardFull = gameBoardSize ** 2
  resetGame()
  // resetGameState()
  // return tempSize
}

function isEmptyCell(coord) {
  // return gBoard[coord.i][coord.j]  === ''
  return !gBoard[coord.i][coord.j]
}

function getEmptyNegsAround(pieceCoord) {
  // handle PAWN use isEmptyCell()
  // var res = [{i:2,j:0},{i:3,j:0}]
  var res = []

  // var diff = isWhite ? -1 : 1
  var nextCoord = { i: pieceCoord.i + diff, j: pieceCoord.j }
  if (isEmptyCell(nextCoord)) res.push(nextCoord)
  else return res

  // if ((!isWhite && pieceCoord.i === 1) || (isWhite && pieceCoord.i === 6)) {
  //   diff *= 2
  //   nextCoord = { i: pieceCoord.i + diff, j: pieceCoord.j }
  //   if (isEmptyCell(nextCoord)) res.push(nextCoord)
  // }

  return res
}

function toggleVisibility() {
  // Get all elements with the class 'hidden'
  const hiddenElements = document.querySelectorAll('.hidden')

  // Loop through each element and toggle the visibility property
  // console.log(hiddenElements)
  hiddenElements.forEach((element) => {
    // console.log(element)

    if (
      element.style.visibility === 'hidden' ||
      element.style.visibility === ''
    ) {
      // console.log(hiddenElements)
      element.style.visibility = 'visible'
    } else {
      // console.log(hiddenElements)
      element.style.visibility = 'hidden'
    }
  })
}

// function onCellClicked(elCell, cellI, cellJ) {
//   if (checkGameOver()) return

//   var clickedCell = gBoard[cellI][cellJ]
//   var cellSpan = elCell.querySelector('span')

//   if (!cellSpan) {
//     return // Handle potential missing cellSpan element
//   }

//   if (!clickedCell.isMine) {
//     if (clickedCell.minesAroundCount === 0) {
//       // Recursive function to reveal empty neighbors
//       revealEmptyNeighbors(cellI, cellJ)
//     } else if (clickedCell.minesAroundCount > 0) {
//       console.log('numedCellTest')
//       // Update UI to display the number of mines around (if not already shown)
//       if (cellSpan.classList.contains('hidden')) {
//         cellSpan.classList.remove('hidden')
//         cellSpan.textContent = clickedCell.minesAroundCount // Display number
//       }
//     }
//     clickedCell.isShown = true
//     gGame.shownCount++
//   }
// }

// function revealEmptyNeighbors(cellSpanParam, cellI, cellJ) {
//   console.log('startReveal')
//   var cellSpan = cellSpanParam
//   // Check bounds to avoid going out of the board
//   if (
//     cellI < 0 ||
//     cellI >= gBoard.length ||
//     cellJ < 0 ||
//     cellJ >= gBoard[cellI].length
//   ) {
//     return
//   }

//   var clickedCell = gBoard[cellI][cellJ]
//   // var cellSpan = document.querySelector(
//   //   `[data-cell-i="${cellI}"][data-cell-j="${cellJ}"] span`
//   // ) // Use data attributes for better selection

//   // if (!cellSpan || clickedCell.isShown) {
//   if (clickedCell.isShown) {
//     return // Avoid redundant checks and infinite recursion
//   }

//   clickedCell.isShown = true
//   cellSpan.classList.remove('hidden')
//   gGame.shownCount++

//   if (clickedCell.minesAroundCount === 0) {
//     // Recursively call for neighbors in all directions (up, down, left, right, diagonals)
//     revealEmptyNeighbors(cellI - 1, cellJ)
//     revealEmptyNeighbors(cellI + 1, cellJ)
//     revealEmptyNeighbors(cellI, cellJ - 1)
//     revealEmptyNeighbors(cellI, cellJ + 1)
//     revealEmptyNeighbors(cellI - 1, cellJ - 1)
//     revealEmptyNeighbors(cellI - 1, cellJ + 1)
//     revealEmptyNeighbors(cellI + 1, cellJ - 1)
//     revealEmptyNeighbors(cellI + 1, cellJ + 1)
//   }
//   console.log('endReveal')
// }
