import { readLines } from "./input"
import { print_number } from "./output"
import Heap from "heap"

async function run() {
  await readLines('15').then(process_a).then(print_number)
  await readLines('15').then(process_b).then(print_number)    
}

type position = { x: number, y: number }
type path = { p: position, risk: number }

const directions = [ {dx: -1, dy: 0}, {dx: 1, dy: 0}, {dx: 0, dy: -1}, {dx: 0, dy: 1} ]

function find(maze: number[][]) {
  const best : Map<string, number> = new Map
  const stack : Heap<path> = new Heap((p1, p2) => p1.risk - p2.risk)

  stack.push({ p: {x: 0, y: 0}, risk: 0 })

  while (!stack.empty()) {
    const current = stack.pop() || {p: {x: 0, y: 0}, risk: 0}
    const risk = best.get(JSON.stringify(current.p))

    if (risk && risk <= current.risk) continue
    best.set(JSON.stringify(current.p), current.risk)

    directions.forEach(d => {
      const np = { x: current.p.x + d.dx, y: current.p.y  + d.dy }
      const nr = maze[np.x] !== undefined ? maze[np.x][np.y] : undefined
      if (nr !== undefined) {
        const next = { p: np, risk: current.risk + nr }
        stack.push(next)
      }
    })
  }

  return best.get(JSON.stringify({x: maze.length - 1, y: maze[0].length - 1})) || 0
}

function process_a(data: string[]) {
  return find(data.map(r => r.split('').map(v => parseInt(v))))
}

function increase(x: number, y: number, v: number) {
  let i = v + x + y
  while (i > 9) i -= 9
  return i  
}

function process_b(data: string[]) {
  const small = data.map(r => r.split('').map(v => parseInt(v)))
  const large : number[][] = []

  for (let r = 0; r < 5; r++)
    for (let c = 0; c < 5; c++)
      for (let y = 0; y < small.length; y++)
        for (let x = 0; x < small[0].length; x++) {
          if (large[r * small.length + y] === undefined) large.push([])
          large[r * small.length + y].push(increase(r, c, small[y][x]))
        }

  return find(large)
}

run()