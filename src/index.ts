import "./style.css";

import {
  Cell,
  CellType,
  EmptyCell,
  PlayedCell,
} from './types/Cell';

import {
  FIRST_MOVE,
  ROWS,
  COLUMNS,
  Row,
  Board as BoardType,
} from './types/Board';

import Board from './models/Board';

function createCell(
  row: number,
  col: number,
): HTMLElement {
  const cell = document.createElement("button");

  cell.setAttribute("data-row", row.toString());
  cell.setAttribute("data-col", col.toString());
  cell.setAttribute("data-content", board.cellValue(row, col));
  cell.classList.add("cell");

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

function renderBoard() {
  if (!appElement) {
    throw new Error("Cannot find app");
  }

  if (!boardElement) {
    throw new Error("Cannot find board");
  }

  boardElement.innerHTML = "";

  for (let i = 0; i < board.rowCount; i++) {
    for (let j = 0; j < board.columnCount; j++) {
      boardElement.appendChild(createCell(i, j));
    }
  }

  const oldMoveElement = document.getElementById("move-element");

  if (oldMoveElement) {
    oldMoveElement.remove();
  }

  const moveElement = document.createElement("p");

  moveElement.id = "move-element";
  moveElement.innerText = `Next Move: ${board.currentMove}`;
  moveElement.classList.add("current-move");
  appElement.insertBefore(moveElement, document.getElementById("reset"));
}

function main() {
  const resetButton = document.getElementById("reset");

  if (!resetButton) {
    throw new Error("No Reset button");
  }

  board = Board.factory();

  resetButton.addEventListener("click", () => {
    board.reset();
    renderBoard();
  });

  board.reset();
  renderBoard();
}

let board: Board;
const appElement = document.getElementById("app");
const boardElement = document.getElementById("board");

main();
