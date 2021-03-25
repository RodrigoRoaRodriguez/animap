export const join = (...words: (string | number | boolean | undefined)[]) =>
  words.filter(Boolean).join(' ')
