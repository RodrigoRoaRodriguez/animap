const make3d = (t = 2, x = t, y = x) =>
  Array.from(Array(t)).fill(Array.from(Array(x)).fill(Array.from(Array(y))))

const make2d = (x = 2, y = x) => Array.from(Array(x)).fill(Array.from(Array(y)))

const map3d = <T>(
  array3d: number[][][],
  fn: (number, indexes: { t: number; x: number; y: number }) => T,
) =>
  array3d.map((time, t) =>
    time.map((row, x) => row.map((el, y) => fn(el, { t, x, y }))),
  )

console.log(map3d(make3d(3), (_, indexes) => JSON.stringify(indexes)))

const array = (length: number) => Array(length).keys()

type ValueOrArray<T = any> = T | Array<ValueOrArray<T>>
type VariableDepthArray<T = any> = Array<ValueOrArray<undefined>>

/** A factory for multidimensional arrays */
const multiArray: (
  length?: number,
  ...extraDimensions: number[]
) => VariableDepthArray<undefined> = (length = 0, ...extraDimensions) =>
  extraDimensions.length > 0
    ? Array.from(Array(length)).fill(multiArray(...extraDimensions))
    : Array.from(Array(length))

const range = (length: number) => Array(length).keys()
