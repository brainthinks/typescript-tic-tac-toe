import TupleOf from './TupleOf';

import {
  CellValue,
  CellType,
} from './Cell';

export const FIRST_MOVE = CellValue.X;
export const ROWS = 3 as const;
export const COLUMNS = 3 as const;

// @todo - how do we make the second param for TupleOf truly dynamic?
export type Row = TupleOf<CellType, typeof ROWS>;
export type Board = TupleOf<Row, typeof COLUMNS>;
