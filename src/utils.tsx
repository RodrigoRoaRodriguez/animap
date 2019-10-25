type fn2d =((index:number, coordinates : {x:number, y: number}, thisArg: XYMatrix) => number)

export class XYMatrix extends Array<number[]> {
  constructor({ size = 0, width = size as number, height = width as number}) {
    super(width)
    this.fill([...Array(height).keys()])
  }

  /**
   * Maps a function on every element of the matrix and returns an array of 
   * arrays that contains the results. 
  */
  map2d = (fn: fn2d ) => super.map((row, y) => row.map((value, x) => fn(value, { x, y }, this)))
}


export const addNoise = (magnitude=0) => (value=0) => value + (Math.random() - 0.5) * 2*magnitude;

export function normalize(max = 1, min = 0) {
  return value => (value - min) / (max - min);
}
