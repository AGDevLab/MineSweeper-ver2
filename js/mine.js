function addMine(board, mineCount) {
  for (var i = 0; i < mineCount; i++) {
    console.log('mineAdded')
    // console.log(board[0][3])
    // random mines
    for (var i = 0; i < gLevel.mines; i++) {
      var randCoordI = 0
      var randCoordJ = 0
      var randMineLoc
      randCoordI = getRandomInt(0, gLevel.size)
      randCoordJ = getRandomInt(0, gLevel.size)
      // for (var j = 0; j < 2; j++) {}
      console.log(randCoordI, randCoordJ)
      // console.log(randCoord)
      randMineLoc = board[randCoordI][randCoordJ]
      // console.log(randMineLoc)

      randMineLoc.isMine = true
    }
  }
}

function setMinesNegsCount(cellI, cellJ, board) {
  // 7,0
  var minesCount = 0
  for (var i = cellI - 1; i <= cellI + 1; i++) {
    if (i < 0 || i >= board.length) continue
    for (var j = cellJ - 1; j <= cellJ + 1; j++) {
      const currCell = board[i][j]

      if (j < 0 || j >= board[i].length) continue
      if (i === cellI && j === cellJ) continue

      if (currCell.isMine) {
        minesCount++
      }
    }
  }
  return minesCount
}

function markFlagHTML() {
  return `<div>${MARK}</div>`
}

// // Relocate mine from the clicked cell to another cell
// function relocateMine(cell) {
//   console.log('relocate')

//   var emptyCells = []
//   for (var i = 0; i < gBoard.length; i++) {
//     for (var j = 0; j < gBoard[0].length; j++) {
//       if (!gBoard[i][j].isMine && gBoard[i][j] !== cell) {
//         emptyCells.push(gBoard[i][j])
//       }
//     }
//   }
//   var newMineCell = emptyCells[Math.floor(Math.random() * emptyCells.length)]
//   newMineCell.isMine = true
//   cell.isMine = false
// }

// // Update the mines count around cells
// function updateMinesNegsCount() {
//   console.log('updateMinesNegsCount')

//   for (var i = 0; i < gBoard.length; i++) {
//     for (var j = 0; j < gBoard[0].length; j++) {
//       gBoard[i][j].minesAroundCount = setMinesNegsCount(i, j, gBoard)
//     }
//   }
// }
