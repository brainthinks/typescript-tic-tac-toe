// @see - https://stackoverflow.com/a/52490977
// @see - https://github.com/microsoft/TypeScript/pull/40002

type TupleOf<T, N extends number> = N extends N ? number extends N ? T[] : _TupleOf<T, N, []> : never;
type _TupleOf<T, N extends number, R extends unknown[]> = R['length'] extends N ? R : _TupleOf<T, N, [T, ...R]>;

export default TupleOf;
