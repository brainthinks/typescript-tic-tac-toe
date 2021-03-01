import './style.scss';

import Board from './models/Board';

function createCell (
  row: number,
  col: number,
): HTMLElement {
  const cell = document.createElement('button');

  cell.setAttribute('data-row', row.toString());
  cell.setAttribute('data-col', col.toString());
  cell.setAttribute('data-content', board.cellValue(row, col));
  cell.classList.add('cell');

  function clickHandler () {
    try {
      board.move(row, col);
      renderBoard();
    }
    catch (error) {
      console.error(error);
    }
    finally {
      cell.removeEventListener('click', clickHandler);
    }
  }

  // @todo - remove the event listener!
  cell.addEventListener('click', clickHandler);

  return cell;
}

function setStatusText () {
  if (!moveElement) {
    throw new Error('No Move text element');
  }

  if (!board.isGameOver) {
    moveElement.innerText = `Next Move: ${board.currentMove}`;
    return;
  }

  if (board.isDraw) {
    moveElement.innerText = 'Draw';
    return;
  }

  moveElement.innerText = `Winner: ${board.winner} by ${board.wonBy}`;
}

function renderBoard () {
  if (!appElement) {
    throw new Error('Cannot find app');
  }

  if (!boardElement) {
    throw new Error('Cannot find board');
  }

  boardElement.innerHTML = '';

  for (let i = 0; i < board.rowCount; i++) {
    const row = document.createElement('div');
    row.classList.add('row');

    for (let j = 0; j < board.columnCount; j++) {
      row.appendChild(createCell(i, j));
    }

    boardElement.appendChild(row);
  }

  setStatusText();
}

function main () {
  const resetButton = document.getElementById('reset');

  if (!resetButton) {
    throw new Error('No Reset button');
  }

  if (!moveElement) {
    throw new Error('No Move text element');
  }

  board = Board.factory();

  resetButton.addEventListener('click', () => {
    board.reset();
    renderBoard();
  });

  board.reset();
  renderBoard();
}

let board: Board;
const appElement = document.getElementById('app');
const boardElement = document.getElementById('board');
const moveElement = document.getElementById('move');

main();
