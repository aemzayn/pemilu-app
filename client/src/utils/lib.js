export const candidateColors = ['#ca0d0d', '#f4e816', '#329b8d']

export function randomHexColor() {
  return '#' + ((Math.random() * 0xffffff) << 0).toString(16).padStart(6, '0')
}

export function randomArrayColors(length) {
  let arr = new Array(length)

  for (let i = 0; i < arr.length; i++) {
    arr[i] = randomHexColor()
  }

  return arr
}
