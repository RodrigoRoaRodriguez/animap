import { addNoise } from './utils'

describe('addNoise', () => {
  it('Returns value when no noise', () => {
    ;[0, 1].forEach((value) =>
      expect(addNoise(value)(0, { x: 0, y: 0 }, 0)).toBe(value),
    )
  })
})
