export function normalize(max = 1, min = 0) {
  return value => (value - min) / (max - min);
}
