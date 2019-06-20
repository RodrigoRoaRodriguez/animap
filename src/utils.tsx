export class XYMatrix extends Array {
  constructor({ size = 0, width = size, height = width }) {
    super(width).fill([...Array(height).keys()])
  }

  map(fn) {
    return super.map((row, y) => row.map((value, x) => fn(value, { x, y })))
  }
}

let test = new XYMatrix({ size: 10 })
console.log('XYMatrix', test)
console.log('XYMatrix', test.map((_, { x, y }) => `x${x}y${y}`).flat())
