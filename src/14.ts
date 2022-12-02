import { readLines } from "./input"
import { print_number } from "./output"

async function run() {
  await readLines('14').then(process_a).then(print_number)
  await readLines('14').then(process_b).then(print_number)    
}


function process_a(data: string[], n = 10) {
  const original = data[0]
  const rules = data.filter(d => d.includes('->')).map(d => ({source: d.split(' -> ')[0], result:d.split(' -> ')[1]}))
  const map : Map<string, string> = new Map

  rules.forEach(r => map.set(r.source, r.result))

  let current : Map<string, number> = new Map
  for (let i = 0; i < original.length - 1; i++) {
    const pair = original[i] + original[i + 1]
    current.set(pair, (current.get(pair) || 0) + 1)
  }

  for (let i = 0; i < n; i++) {
    let next : Map<string, number> = new Map
    current.forEach((count, pair) => {
      const p1 = pair[0] + map.get(pair)
      const p2 = map.get(pair) + pair[1]
      next.set(p1, (next.get(p1) || 0) + count)
      next.set(p2, (next.get(p2) || 0) + count)
    })
    current = next
  }

  const letters : Map<string, number> = new Map
  letters.set(original[0], 1)
  current.forEach((count, pair) => letters.set(pair[1], (letters.get(pair[1]) || 0) + count))

  return Math.max(...Array.from(letters.values())) - Math.min(...Array.from(letters.values()))
}

function process_b(data: string[]) {
  return process_a(data, 40)
}

run()