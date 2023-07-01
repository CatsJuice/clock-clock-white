export function fillZero(v: number | string, length = 2) {
  const str = `${v}`
  const len = str.length
  if (len >= length)
    return str

  return new Array(length - len + 1).join('0') + str
}
