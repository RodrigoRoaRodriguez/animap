export const make3d = (t = 2, y = t, x = y) =>
  Array.from(Array(t)).fill(Array.from(Array(y)).fill(Array.from(Array(x))))

export const make2d = (x = 2, y = x) =>
  Array.from(Array(x)).fill(Array.from(Array(y)))

export const map2d = <T, R>(
  array2d: T[][],
  fn: (value: T, indexes: { x: number; y: number }) => R,
) => array2d.map((row, y) => row.map((value, x) => fn(value, { y, x })))

export const map3d = <T, R>(
  array3d: T[][][],
  fn: (value: T, indexes: { t: number; x: number; y: number }) => R,
) =>
  array3d.map((time, t) =>
    time.map((row, y) => row.map((value, x) => fn(value, { t, y, x }))),
  )
