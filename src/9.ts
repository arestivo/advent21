import { readLines } from "./input"
import { print_number } from "./output"

async function run() {
  await readLines('9').then(process_a).then(print_number)
  await readLines('9').then(process_b).then(print_number)    
}

const directions = [{x: -1, y: 0}, {x: 1, y: 0}, {x: 0, y: -1}, {x: 0, y: 1}]

function process_a(data: string[]) {
  const heights = data.map(r => r.split(''))

  const risk = heights.reduce((levels: {x: number, y: number, level: number}[], row, y) => levels.concat(row.map((height, x) => ({x, y, level: parseInt(heights[y][x])}))).filter(p => directions.every(d => heights[p.y + d.y] === undefined || heights[p.y + d.y][p.x+ d.x] === undefined || parseInt(heights[p.y + d.y][p.x+ d.x]) > p.level)), []).map(l => l.level + 1).reduce((s, l) => s + l, 0)

  return risk
}

function process_b(data: string[]) {
  const heights = data.map(r => r.split(''))

  const bottoms = heights.reduce((levels: {x: number, y: number, level: number}[], row, y) => levels.concat(row.map((height, x) => ({x, y, level: parseInt(heights[y][x])}))).filter(p => directions.every(d => heights[p.y + d.y] === undefined || heights[p.y + d.y][p.x+ d.x] === undefined || parseInt(heights[p.y + d.y][p.x+ d.x]) > p.level)), [])

  let basins : number[] = [] 

  bottoms.forEach(b => {
    const heights = data.map(r => r.split(''))
    const stack = [{x: b.x, y: b.y}]
    while (stack.length > 0) {
      const c = stack.pop()
      if (!c) break
      if (heights[c.y][c.x] === 'X') continue
      heights[c.y][c.x] = 'X'
      directions.forEach(d => {if (heights[c.y + d.y] !== undefined && heights[c.y + d.y][c.x+ d.x] !== undefined && heights[c.y + d.y][c.x+ d.x] !== '9') stack.push({x: c.x + d.x, y: c.y + d.y})}) 
    }
    basins.push(heights.map(r => r.join('')).map(r => r.split('')).flatMap(l => l.filter(l => l === 'X').length).reduce((c, n) => c + n))
    if (basins[basins.length - 1] === 75) console.log(heights.map(r => r.join('')))
  })

  basins.sort((a, b) => b - a)
  console.log(basins)
  return basins.slice(0, 3).reduce((m, b) => b * m, 1)

  return 0
}

run()