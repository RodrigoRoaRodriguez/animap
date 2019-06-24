export class XYMatrix extends Array {
  constructor({ size = 0, width = size, height = width }) {
    super(width)
    this.fill([...Array(height).keys()])
  }

  deepMap(fn: ((n:number, { x, y }: {x:number, y: number}) => any)) {
    return super.map((row, y) => row.map((value, x) => fn(value, { x, y })))
  }
}
