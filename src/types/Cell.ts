/**
 * A demonstration of dynamic use of enums.
 *
 * Tested with Typescript 4.2
 *
 * I originally implemented a non-typescript-y workaround:
 *
 * @see - https://github.com/Microsoft/TypeScript/issues/17592#issuecomment-449440944
 * @see - an older commit
 */

// Single value enum representing an empty cell.
// The key and value are different.
// The value is a string literal.
export enum EmptyCell {
  empty = "",
}

// The union of keys
type EmptyCellKeys = keyof typeof EmptyCell;
// The union of string literal values
type EmptyCellValuesString = `${EmptyCell}`
// The enum expressed as a type where the values are the enum values
type EmptyCellTypeEnum = {
  [P in keyof typeof EmptyCell]: typeof EmptyCell[P];
}
// The enum expressed as a type where the values are the enum's string literals
type EmptyCellTypeString = {
  [P in keyof typeof EmptyCell]: `${EmptyCell}`;
}
// @todo - The union of enum type values
// type EmptyCellValuesType = EmptyCellTypeEnum[keyof typeof EmptyCell];


// Enum representing all playable cells
// All keys are identical to their respective values.
// All values are string literals
export enum PlayedCell {
  X = "X",
  O = "O",
}

// The union of keys
type PlayedCellKeys = keyof typeof PlayedCell;
// The union of string literal values
type PlayedCellValuesString = `${PlayedCell}`;
// The enum expressed as a type where the values are enum values
type PlayedCellTypeEnum = {
  [P in keyof typeof PlayedCell]: typeof PlayedCell[P];
}
// The enum expressed as a type where the values are the enum's string literals
type PlayedCellTypeString = {
  [P in keyof typeof PlayedCell]: `${PlayedCell}`;
}
// @todo - The union of enum type values
// type PlayedCellValuesType = PlayedCellTypeEnum[keyof typeof PlayedCell];

// Union of all keys on enum by reading the keys directly from each enum
type CellKeys1 = keyof typeof EmptyCell | keyof typeof PlayedCell;
// Union of all keys on enum by using a union on the already-collected keys
type CellKeys2 = EmptyCellKeys | PlayedCellKeys;

// Union of all values as enum types read directly from the enums
// Use this to be strict about the type, e.g. value must be explicit `PlayedCell.X`
type CellValuesEnum1 = (typeof EmptyCell[keyof typeof EmptyCell]) | (typeof PlayedCell[keyof typeof PlayedCell])
// Union of all values as enum types read from the alread-collected values
// Use this to be strict about the type, e.g. value must be explicit `PlayedCell.X`
type CellValuesEnum2 = EmptyCell | PlayedCell;
// Union of all values as string literals read directly from the enums
// Use this to be lax about the type, e.g. value can be explicit `PlayedCell.X` or `"X"`
type CellValuesString1 = `${EmptyCell}` | `${PlayedCell}`;
// Union of all values as string literals read from the alread-collected values
// Use this to be lax about the type, e.g. value can be explicit `PlayedCell.X` or `"X"`
type CellValuesString2 = EmptyCellValuesString | PlayedCellValuesString;

/**
 * A collection of fake tests to get the typescript compiler / linter to show
 * you that the types declared above really work.
 */
function tests () {
  function testValues(x: CellValuesString1) {
    console.log(x);
  }

  function testKeys(x: CellKeys1) {
    console.log(x);
  }

  testValues(EmptyCell.empty)
  testValues("") // should pass
  // testValues("empty") // should fail
  // testKeys(EmptyCell.empty) // should fail
  testKeys('empty')

  testValues(PlayedCell.X)
  testValues("X")
  testKeys(PlayedCell.X)
  testKeys('X')

  testValues(PlayedCell.O)
  testValues("O")
  testKeys(PlayedCell.O)
  testKeys('O')
}

export type CellType = CellValuesEnum2;

// @todo
export const Cell = {
  ...EmptyCell,
  ...PlayedCell,
};
