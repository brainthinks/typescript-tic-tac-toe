import TupleOf from './TupleOf';

import {
  CellValue,
  CellType,
} from './Cell';

export const FIRST_MOVE = CellValue.X;
export const ROWS = 3;
export const COLUMNS = 3;

// @todo - how do we make the second param for TupleOf dynamic?
export type Row = TupleOf<CellType, 3>;
export type Board = TupleOf<Row, 3>;
