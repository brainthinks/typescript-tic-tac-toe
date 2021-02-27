import TupleOf from './TupleOf';

import {
  Cell,
  CellType,
} from './Cell';

export const FIRST_MOVE = Cell.X;
export const ROWS = 3;
export const COLUMNS = 3;

// @todo - how do we make the second param for TupleOf dynamic?
export type Row = TupleOf<CellType, 3>;
export type Board = TupleOf<Row, 3>;
