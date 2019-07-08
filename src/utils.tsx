export class XYMatrix extends Array<number[]> {
  constructor({ size = 0, width = size, height = width }) {
    super(width)
    this.fill([...Array(height).keys()])
  }

  map2d<U>(fn: ((n:number, { x, y }: {x:number, y: number}, thisArg: XYMatrix) => number) ) {
    return super.map((row, y) => row.map((value, x) => fn(value, { x, y }, this)))
  }
}
