import { readLines } from "./input"
import { print_number } from "./output"

async function run() {
  await readLines('13').then(process_a)
  await readLines('13').then(process_b)    
}

function foldx(paper : string[][], n: number) {
  const width = paper[0].length
  const reversed = n < (width - 1) / 2

  if (reversed) {
    n = width - n - 1
    paper = paper.map(r => r.reverse())
  }

  const folded : string[][] = Array(paper.length).fill(null).map(()=>Array(n).fill('.'))

  for (let y = 0; y < folded.length; y++)
    for (let x = 0; x < folded[0].length; x++)
      folded[y][x] = (paper[y][x] === '#' || paper[y][2 * n - x] === '#') ? '#' : '.'

  if (reversed) return folded.map(r => r.reverse())    
  return folded
}

function foldy(paper : string[][], n: number) {
  const height = paper.length
  const reversed = n < (height - 1) / 2

  if (reversed) {
    n = height - n - 1
    paper = paper.reverse()
  }

  const folded : string[][] = Array(n).fill(null).map(()=>Array(paper[0].length).fill('.'))

  for (let y = 0; y < folded.length; y++)
    for (let x = 0; x < folded[0].length; x++)
      folded[y][x] = (paper[y][x] === '#' || (paper[2 * n - y] && paper[2 * n - y][x] === '#')) ? '#' : '.'

  if (reversed) return folded.reverse()
  return folded
}

function print(paper: string[][]) {
  for (let y = 0; y < paper.length; y++)
    console.log(paper[y].join(''))     
}

function process_a(data: string[], n: number = 1) {
  const dots = data.filter(d => d.includes(','))
  const width = Math.max(...dots.map(r => parseInt(r.split(',')[0]))) + 1
  const height = Math.max(...dots.map(r => parseInt(r.split(',')[1]))) + 1

  let paper : string[][] = Array(height).fill(null).map(()=>Array(width).fill('.'))
  dots.map(d => d.split(',').map(d => parseInt(d))).forEach(d => paper[d[1]][d[0]] = '#')

  const instructions = data.filter(l => l.includes('fold')).map(l => l.split(' ')[2]).map(l => l.split('='))

  if (n === 0) n = instructions.length

  for (let i = 0; i < n; i++) {
    if (instructions[i][0] == 'x') paper = foldx(paper, parseInt(instructions[i][1]))
    if (instructions[i][0] == 'y') paper = foldy(paper, parseInt(instructions[i][1]))  
  }

  print(paper)
  console.log(paper.reduce((c, r) => c + r.reduce((c, d) => c + (d === '#' ? 1 : 0), 0), 0))
}

function process_b(data: string[]) {
  return process_a(data, 0)
}

run()