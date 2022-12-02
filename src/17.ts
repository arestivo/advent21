import { readLine } from "./input"
import { print_number } from "./output"

async function run() {
  await readLine('17').then(process_a).then(print_number)
  await readLine('17').then(process_b).then(print_number)    
}

type area = {x1: number, x2: number, y1: number, y2: number}

function get_area(data: string) {
  const coords = data.split(',').map(s => s.split('=')[1]).flatMap(s => s.split('..')).map(s => parseInt(s, 10))
  return {x1: coords[0], x2: coords[1], y1: coords[2], y2: coords[3]}
}

function test(a: area, vx: number, vy: number) {
  let x = 0, y = 0
  let max = 0
  let hit = false

  do {
    max = Math.max(y, max)
    if (x >= a.x1 && x <= a.x2 && y >= a.y1 && y <= a.y2) hit = true

    x += vx
    y += vy
    vx += vx === 0 ? 0 : (vx > 0 ? -1 : 1)
    vy -= 1
  } while(x <= a.x2 && y >= a.y1)

  return {max, hit}
}

function process_a(data: string) {
  const area = get_area(data)
  let best = 0

  for (let vx = 1; vx < 500; vx++)
    for (let vy = 1; vy < 100; vy++) {
      const result = test(area, vx, vy)
      if (result.hit) best = Math.max(best, result.max)
    }

  return best
}

function process_b(data: string) {
  const area = get_area(data)
  let count = 0

  for (let vx = 1; vx < 500; vx++)
    for (let vy = -100; vy < 100; vy++) {
      const result = test(area, vx, vy)
      if (result.hit) count++
    }

  return count
}

run()