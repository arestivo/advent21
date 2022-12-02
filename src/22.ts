import { readLines } from "./input"
import { print_number } from "./output"

async function run() {
  await readLines('22').then(process_a).then(print_number)
  await readLines('22').then(process_b).then(print_number)    
}

function process_a(data: string[]) {
  const instructions = data.map(d => {
    const op = d.split(' ')[0]
    const parts = d.split(' ')[1].split(',')
    const x1 = parseInt(parts[0].split('=')[1].split('..')[0])
    const x2 = parseInt(parts[0].split('=')[1].split('..')[1])
    const y1 = parseInt(parts[1].split('=')[1].split('..')[0])
    const y2 = parseInt(parts[1].split('=')[1].split('..')[1])
    const z1 = parseInt(parts[2].split('=')[1].split('..')[0])
    const z2 = parseInt(parts[2].split('=')[1].split('..')[1])
   return { op, x1, x2, y1, y2, z1, z2 }
  })  

  const cubes: Map<string, boolean> = new Map
  for (const ins of instructions) {
    for (let x = Math.max(-50, ins.x1); x <= Math.min(50, ins.x2); x++)
      for (let y = Math.max(-50, ins.y1); y <= Math.min(50, ins.y2); y++)
        for (let z = Math.max(-50, ins.z1); z <= Math.min(50, ins.z2); z++) {
          const cube = {x, y, z}
          cubes.set(JSON.stringify(cube), ins.op === 'on')
        }
  }

  return Array.from(cubes.entries()).filter(s => s[1]).length
}

type region = {x1: number, x2: number, y1: number, y2: number, z1: number, z2: number }

function intersect (r1: region, r2: region) : region | false {
  const x1 = Math.max(r1.x1, r2.x1)
  const y1 = Math.max(r1.y1, r2.y1)
  const z1 = Math.max(r1.z1, r2.z1)
  const x2 = Math.min(r1.x2, r2.x2)
  const y2 = Math.min(r1.y2, r2.y2)
  const z2 = Math.min(r1.z2, r2.z2)
  if (x1 <= x2 && y1 <= y2 && z1 <= z2) return { x1, x2, y1, y2, z1, z2 }
  return false
}

function volume (r: region) {
  return (r.x2 - r.x1 + 1) * (r.y2 - r.y1 + 1) * (r.z2 - r.z1 + 1)
}

function process_b(data: string[]) {
  const instructions = data.map(d => {
    const op = d.split(' ')[0]
    const parts = d.split(' ')[1].split(',')
    const x1 = parseInt(parts[0].split('=')[1].split('..')[0])
    const x2 = parseInt(parts[0].split('=')[1].split('..')[1])
    const y1 = parseInt(parts[1].split('=')[1].split('..')[0])
    const y2 = parseInt(parts[1].split('=')[1].split('..')[1])
    const z1 = parseInt(parts[2].split('=')[1].split('..')[0])
    const z2 = parseInt(parts[2].split('=')[1].split('..')[1])
    return { op, region: { x1, x2, y1, y2, z1, z2 }}
  })  

  const regions: Map<string, number> = new Map
  for (const i of instructions) {
    for (const r of Array.from(regions.entries())) {
      const x = intersect(JSON.parse(r[0]), i.region)
      if (x) regions.set(JSON.stringify(x), (regions.get(JSON.stringify(x)) || 0) - (regions.get(r[0]) || 0))
    }
    if (i.op === 'on') regions.set(JSON.stringify(i.region), 1) 
  }

  return Array.from(regions.entries()).reduce((total, [cube, value]) => total + volume(JSON.parse(cube)) * value, 0)
}

run()