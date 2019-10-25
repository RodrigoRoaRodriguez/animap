import { addNoise } from "./utils";

describe("addNoise", () => {
  it("Returns value when no noise", () => {
    [0, 1].forEach(value => expect(addNoise(value, 0)).toBe(value));
  });
});
