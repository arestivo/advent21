import { readLine } from "./input"
import { print_number } from "./output"

async function run() {
  await readLine('7').then(process_a).then(print_number)
  await readLine('7').then(process_b).then(print_number)    
}

function process_a(data: string) {
  const positions = data.split(',').map(s => parseInt(s)).sort((a, b) => a - b)
  const costs = []

  let current = positions.slice(1).reduce((c, p) => c + (p - positions[0]), 0)
  costs.push(current)
    
  for (let i = 1; i < positions.length; i++) {
    const delta = positions[i] - positions[i - 1]

    current += i * delta
    current -= (positions.length - i) * delta
 
    costs.push(current)
  }

  return Math.min(...costs)
}

function process_b(data: string) {
  const positions = data.split(',').map(s => parseInt(s)).sort((a, b) => a - b)

  const costs = []
  const cost : number[] = []

  for (let a = 0, current = 0; a <= positions[positions.length - 1]; a++, current += a) {
    cost.push(current)
  }


  for (let a = 0; a <= positions[positions.length - 1]; a++) {
    costs.push(positions.reduce((c, p) => c + cost[Math.abs(a - p)], 0))
  }


  return Math.min(...costs)
}

run()