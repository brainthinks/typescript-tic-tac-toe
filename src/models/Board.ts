import noop from 'lodash/noop';

import {
  CellValue,
  CellType,
  EmptyCell,
  PlayedCell,
} from '../types/Cell';

import {
  FIRST_MOVE,
  ROWS,
  COLUMNS,
  Board as BoardType,
} from '../types/Board';

export interface GameStats {
  winner: PlayedCell | null;
  wonBy: string | null;
  isDraw: boolean;
}

export type OnGameOverType = (gameStats: GameStats) => void;

export default class Board {
  // The properties below which are not-null-asserted are assigned in the
  // `reset` method, which is called in the constructor.
  board!: BoardType;
  currentMove!: PlayedCell;
  winner!: PlayedCell | null;
  wonBy!: string | null;
  isDraw!: boolean;
  isGameOver!: boolean;
  moveCount!: number;
  onGameOver: OnGameOverType = noop;
  readonly rowCount: number = ROWS;
  readonly columnCount: number = COLUMNS;
  readonly maxMoves: number = this.rowCount * this.columnCount;

  static factory (onGameOver: OnGameOverType = noop): Board {
    return new Board(onGameOver);
  }

  private constructor (onGameOver: OnGameOverType = noop) {
    this.reset();

    this.onGameOver = onGameOver;

    if (this.rowCount !== this.columnCount) {
      throw new Error('rows and columns must be the same dimensions');
    }
  }

  get nextMove (): PlayedCell {
    return this.currentMove === CellValue.X
      ? CellValue.O
      : CellValue.X;
  }

  private resetBoard () {
    this.board = Array(this.rowCount).fill(null).map(() => {
      return Array(this.columnCount).fill(CellValue.empty);
    }) as BoardType;
  }

  reset (): void {
    this.resetBoard();
    this.winner = null;
    this.wonBy = null;
    this.isDraw = false;
    this.currentMove = FIRST_MOVE;
    this.isGameOver = false;
    this.moveCount = 0;
  }

  validateRow (row: unknown): void {
    if (typeof row !== 'number' || row < 0 || row >= this.rowCount) {
      throw new Error(`"${row}" is not a valid row index`);
    }
  }

  validateColumn (column: unknown): void {
    if (typeof column !== 'number' || column < 0 || column >= this.columnCount) {
      throw new Error(`"${column}" is not a valid column index`);
    }
  }

  cellValue (row: number, column: number): CellType {
    this.validateRow(row);
    this.validateColumn(column);

    return this.board[row][column];
  }

  move (row: number, column: number): void {
    if (this.isGameOver) {
      throw new Error('Cannot move after game has ended');
    }

    this.validateRow(row);
    this.validateColumn(column);

    if (this.cellValue(row, column) in PlayedCell) {
      throw new Error(`Cannot play cell ${row},${column} - cell already played.`);
    }

    this.board[row][column] = this.currentMove;

    this.checkWinCondition();

    this.moveCount++;

    if (this.moveCount === this.maxMoves) {
      return this.drawConditionMet();
    }

    this.currentMove = this.nextMove;
  }

  private winConditionMet (winner: PlayedCell, wonBy: string): void {
    this.winner = winner;
    this.wonBy = wonBy;
    this.isDraw = false;
    this.isGameOver = true;

    console.log('winner is ', this.winner, ' by ', this.wonBy);

    this.onGameOver({
      winner: this.winner,
      wonBy: this.wonBy,
      isDraw: this.isDraw,
    });
  }

  private drawConditionMet (): void {
    this.winner = null;
    this.wonBy = null;
    this.isDraw = true;
    this.isGameOver = true;

    console.log('game is over, draw');

    this.onGameOver({
      winner: this.winner,
      wonBy: this.wonBy,
      isDraw: this.isDraw,
    });
  }

  private isEmptyCellValue (cellValue: CellType): cellValue is EmptyCell {
    return Object.values(EmptyCell).includes(cellValue as EmptyCell);
  }

  private isPlayedCellValue (cellValue: CellType): cellValue is PlayedCell {
    return Object.values(PlayedCell).includes(cellValue as PlayedCell);
  }

  checkWinCondition (): void {
    type BoardStateTracker = {
      [prop in PlayedCell]: number;
    }

    type BoardStateTrackers = BoardStateTracker[];

    const rowCounts: BoardStateTrackers = Array(this.rowCount).fill(null).map(() => ({
      [PlayedCell.X]: 0,
      [PlayedCell.O]: 0,
    }));

    const columnCounts: BoardStateTrackers = Array(this.columnCount).fill(null).map(() => ({
      [PlayedCell.X]: 0,
      [PlayedCell.O]: 0,
    }));

    const diagA = {
      [PlayedCell.X]: 0,
      [PlayedCell.O]: 0,
    };

    const diagB = {
      [PlayedCell.X]: 0,
      [PlayedCell.O]: 0,
    };

    for (let row = 0; row < this.rowCount; row++) {
      for (let column = 0; column < this.columnCount; column++) {
        // @todo - prematurely asserting here.  Is there a better way to do it?
        const cellValue = this.cellValue(row, column);

        if (this.isEmptyCellValue(cellValue)) {
          continue;
        }

        rowCounts[row][cellValue]++;
        columnCounts[column][cellValue]++;

        if (rowCounts[row][cellValue] === this.rowCount) {
          return this.winConditionMet(cellValue, `row ${row}`);
        }

        if (columnCounts[column][cellValue] === this.columnCount) {
          return this.winConditionMet(cellValue, `column ${column}`);
        }
      }

      const diagAValue = this.cellValue(row, row);

      if (this.isPlayedCellValue(diagAValue)) {
        diagA[diagAValue]++;

        if (diagA[diagAValue] === this.columnCount) {
          return this.winConditionMet(diagAValue, 'diagA');
        }
      }

      const diagBValue = this.cellValue(row, this.columnCount - row - 1);

      if (this.isPlayedCellValue(diagBValue)) {
        diagB[diagBValue]++;

        if (diagB[diagBValue] === this.columnCount) {
          return this.winConditionMet(diagBValue, 'diagB');
        }
      }
    }
  }
}
