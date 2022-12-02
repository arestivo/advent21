import { readLines } from "./input"
import { print_number } from "./output"

async function run() {
  await readLines('12').then(process_a).then(print_number)
  await readLines('12').then(process_b).then(print_number)    
}

function big(cave: string) {
  return cave.toUpperCase() === cave
}

const mem_a : Map<string, number> = new Map
const mem_b : Map<string, number> = new Map

function make_graph(data: string[]) {
  const nodes : Map<string, string[]> = new Map

  data.forEach(l => {
    const [from, to] = l.split('-')
    if (!nodes.has(from)) nodes.set(from, [])
    if (!nodes.has(to)) nodes.set(to, [])
    nodes.get(from)?.push(to)
    nodes.get(to)?.push(from)
  })

  return nodes
}

function number_a(nodes: Map<string, string[]>, path: string) {
  if (mem_a.has(path)) return mem_a.get(path) || 0

  const parts = path.split(',')
  const tail = parts[parts.length - 1]

  if (tail === 'end') return 1

  let count = 0

  nodes.get(tail)?.forEach(n => {
    if (big(n) || !parts.includes(n)) {
      count += number_a(nodes, `${path},${n}`)
    }
  })  

  mem_a.set(path, count)

  return count
}

function number_b(nodes: Map<string, string[]>, path: string) {
  if (mem_b.has(path)) return mem_b.get(path) || 0

  const parts = path.split(',')
  const tail = parts[parts.length - 1]

  if (tail === 'end') return 1

  let count = 0

  nodes.get(tail)?.forEach(n => {
    if (n !== 'start') {
      if (!big(n) && parts.includes(n)) count += number_a(nodes, `${path},${n}`)
      else count += number_b(nodes, `${path},${n}`)
    }
  })  

  mem_b.set(path, count)

  return count
}

function process_a(data: string[]) {
  return number_a(make_graph(data), 'start')
}

function process_b(data: string[]) {
  return number_b(make_graph(data), 'start')
}

run()