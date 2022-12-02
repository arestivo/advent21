import { readLines } from "./input"
import { print_number } from "./output"

async function run() {
  await readLines('5').then(process_a).then(print_number)
  await readLines('5').then(process_b).then(print_number)    
}

type line = { x1: number, y1: number, x2: number, y2: number }
type point = { x: number, y: number }

function process_a(data: string[]) {
  const lines = data.map(l => l.split(' -> ').flatMap(p => p.split(',').map(s => parseInt(s)))).map(c => ({x1: c[0], y1: c[1], x2: c[2], y2: c[3]}))
  const points : Map<string, number> = new Map

  lines.forEach(l => {
    const dx = ((l.x2 - l.x1) / Math.abs(l.x2 - l.x1)) || 0
    const dy = ((l.y2 - l.y1) / Math.abs(l.y2 - l.y1)) || 0
    if (dx === 0 || dy === 0) 
      for (let i = 0; i <= Math.max(Math.abs(l.x2 - l.x1), Math.abs(l.y2 - l.y1)); i++)
        points.set(`${l.x1 + i * dx},${l.y1 + i * dy}`, (points.get(`${l.x1 + i * dx},${l.y1 + i * dy}`) || 0) + 1)  
  })

  return Array.from(points).reduce((c, p) => c + (p[1] > 1 ? 1 : 0), 0)
}

function process_b(data: string[]) {
  const lines = data.map(l => l.split(' -> ').flatMap(p => p.split(',').map(s => parseInt(s)))).map(c => ({x1: c[0], y1: c[1], x2: c[2], y2: c[3]}))
  const points : Map<string, number> = new Map

  lines.forEach(l => {
    const dx = ((l.x2 - l.x1) / Math.abs(l.x2 - l.x1)) || 0
    const dy = ((l.y2 - l.y1) / Math.abs(l.y2 - l.y1)) || 0
    for (let i = 0; i <= Math.max(Math.abs(l.x2 - l.x1), Math.abs(l.y2 - l.y1)); i++)
      points.set(`${l.x1 + i * dx},${l.y1 + i * dy}`, (points.get(`${l.x1 + i * dx},${l.y1 + i * dy}`) || 0) + 1)  
  })

  return Array.from(points).reduce((c, p) => c + (p[1] > 1 ? 1 : 0), 0)
}

run()