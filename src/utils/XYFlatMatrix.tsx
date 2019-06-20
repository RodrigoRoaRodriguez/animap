export class XYFlatMatrix extends Array {
  constructor(size = 0) {
    super(size).fill([...Array(size).keys()])
  }

  map(fn) {
    return super.map((row, y) => row.map((value, x) => fn(value, { x, y })))
  }
}
let test = new XYFlatMatrix(10)
console.log('XYFlatMatrix', test)
console.log('XYFlatMatrix', test.map((_, { x, y }) => `x${x}y${y}`).flat())
