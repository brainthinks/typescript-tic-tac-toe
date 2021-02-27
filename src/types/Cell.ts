export enum EmptyCell {
  "empty" = "",
}

export enum PlayedCell {
  "X" = "X",
  "O" = "O",
}

// @see - https://github.com/Microsoft/TypeScript/issues/17592#issuecomment-449440944
export type CellType = EmptyCell | PlayedCell;
export const Cell = {
  ...EmptyCell,
  ...PlayedCell,
};
