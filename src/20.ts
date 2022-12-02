import { readLines } from "./input"
import { print_number } from "./output"

async function run() {
  await readLines('20').then(process_a).then(print_number)
  await readLines('20').then(process_b).then(print_number)    
}


function pixel(image: string[][], r: number, c: number, iteration: number) {
  return image[r] ? (image[r][c] ? image[r][c] : (iteration % 2 === 0 ? '.' : '#')) : (iteration % 2 === 0 ? '.' : '#')
}

function average(image: string[][], r: number, c: number, iteration: number) {
  const average = []

  for (let i = r - 1; i <= r + 1; i++)
    for (let j = c - 1; j <= c + 1; j++)
      average.push(pixel(image, i, j, iteration))
  
  return parseInt(average.map(c => c === '#' ? '1' : '0').join(''), 2)
}

function apply(image: string[][], iea: string, iteration: number) {
  const result : string[][] = []

  for (let r = -1; r <= image.length; r++) {
    result.push([])
    for (let c = -1; c <= image[0].length; c++) {
      result[result.length - 1].push(iea[average(image, r, c, iteration)])
    }
  }

  return result
}

function print(image: string[][]) {
  image.forEach(r => console.log(r.join('')))
}

function process_a(data: string[]) {
  const iea = data[0]
  let image = data.slice(2).map(r => r.split(''))

  return apply(apply(image, iea, 0), iea, 1).map(r => r.reduce((c, p) => c + (p === '#' ? 1 : 0), 0)).reduce((c, r) => c + r, 0)
}

function process_b(data: string[]) {
  const iea = data[0]
  let image = data.slice(2).map(r => r.split(''))

  for (let i = 0; i < 50; i++)
    image = apply(image, iea, i)

  return image.map(r => r.reduce((c, p) => c + (p === '#' ? 1 : 0), 0)).reduce((c, r) => c + r, 0)
}

run()