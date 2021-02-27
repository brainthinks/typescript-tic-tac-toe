import {
  Cell,
  CellType,
  EmptyCell,
  PlayedCell,
} from '../types/Cell';

import {
  FIRST_MOVE,
  ROWS,
  COLUMNS,
  Row,
  Board as BoardType,
} from '../types/Board';
import { throws } from 'assert';

export default class Board {
  board: BoardType;
  currentMove: PlayedCell;
  gameOver: boolean;
  moveCount: number;
  rowCount: number = ROWS;
  columnCount: number = COLUMNS;
  maxMoves: number = this.rowCount * this.columnCount;

  static factory () {
    return new Board();
  }

  private constructor () {
    this.reset();
  }

  get nextMove () {
    return this.currentMove === Cell.X
      ? Cell.O
      : Cell.X;
  }

  private resetBoard () {
    this.board = [
      [Cell.empty, Cell.empty, Cell.empty],
      [Cell.empty, Cell.empty, Cell.empty],
      [Cell.empty, Cell.empty, Cell.empty],
    ];
  }

  reset (): void {
    this.resetBoard();
    this.currentMove = FIRST_MOVE;
    this.gameOver = false;
    this.moveCount = 0;
  }

  validateRow (row: any): void {
    if (row < 0 || row >= this.rowCount) {
      throw new Error(`"${row}" is not a valid row index`);
    }
  }

  validateColumn (column: any): void {
    if (column < 0 || column >= this.columnCount) {
      throw new Error(`"${column}" is not a valid column index`);
    }
  }

  cellValue (row: number, column: number): CellType {
    this.validateRow(row);
    this.validateColumn(column);

    return this.board[row][column];
  }

  move (row: number, column: number): void {
    if (this.gameOver) {
      throw new Error('Cannot move after game has ended');
    }

    this.moveCount++;

    if (this.moveCount === this.maxMoves) {
      return this.staleMate();
    }

    this.validateRow(row);
    this.validateColumn(column);

    if (this.cellValue(row, column) in PlayedCell) {
      throw new Error(`Cannot play cell ${row},${column} - cell already played.`);
    }

    this.board[row][column] = this.currentMove;

    this.checkWinCondition();

    this.currentMove = this.nextMove;
  }

  winConditionMet (winner: PlayedCell) {
    this.gameOver = true;
    console.log('winner is ', winner);
  }

  staleMate () {
    console.log('losers!')
  }

  checkWinCondition () {
    // check win via row
    for (let row = 0; row < this.rowCount; row++) {
      let occurrencesInRow = 0;
      let firstCell = this.cellValue(row, 0);

      // If the first cell in the row hasn't been played, there is no win via
      // row
      if (Object.values(EmptyCell).includes(firstCell)) {
        continue;
      }

      for (let column = 0; column < this.columnCount; column++) {
        // if subsequent cells in the row aren't the same as the first,
        // there is no win via row
        if (firstCell !== this.cellValue(row, column)) {
          break;
        }

        occurrencesInRow++;
      }

      if (occurrencesInRow === this.columnCount) {
        return this.winConditionMet(firstCell);
      }
    }

    // check win via row
    for (let column = 0; column < this.columnCount; column++) {
      let occurrencesInColumn = 0;
      let firstCell = this.cellValue(0, column);

      // If the first cell in the row hasn't been played, there is no win via
      // column
      if (Object.values(EmptyCell).includes(firstCell)) {
        continue;
      }

      for (let row = 0; row < this.rowCount; row++) {
        // if subsequent cells in the column aren't the same as the first,
        // there is no win via column
        if (firstCell !== this.cellValue(row, column)) {
          break;
        }

        occurrencesInColumn++;
      }

      if (occurrencesInColumn === this.rowCount) {
        return this.winConditionMet(firstCell);
      }
    }

    // check diagonals
    if (ROWS === COLUMNS) {
      // diagonal A is one type
      // 0,0 1,1 2,2 x+1,y+1
      let occurrencesInDiagonal = 0;
      let firstCell: CellType | null = null;

      for (let row = 0, column = 0; row < this.rowCount; row++, column++) {
        if (firstCell === null) {
          firstCell = this.cellValue(row, column);

          if (Object.values(EmptyCell).includes(firstCell)) {
            continue;
          }
        }

        if (firstCell === this.cellValue(row, column)) {
          occurrencesInDiagonal++;
        }
      }

      if (occurrencesInDiagonal === this.rowCount) {
        console.log('won via diagonalA')
        return this.winConditionMet(firstCell);
      }

      // diagonal B is one type
      // 0,2 1,1 2,0 x+1,y-1
      occurrencesInDiagonal = 0;
      firstCell = null;

      for (let row = 0, column = (this.columnCount - 1); row < this.rowCount; row++, column--) {
        if (firstCell === null) {
          firstCell = this.cellValue(row, column);

          if (Object.values(EmptyCell).includes(firstCell)) {
            continue;
          }
        }

        if (firstCell === this.cellValue(row, column)) {
          occurrencesInDiagonal++;
        }
      }

      if (occurrencesInDiagonal === this.rowCount) {
        console.log('won via diagonalB')
        return this.winConditionMet(firstCell);
      }
    }
  }
}
