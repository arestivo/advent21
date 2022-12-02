import { readLines } from "./input"
import { print_number } from "./output"

async function run() {
  await readLines('1').then(process_a).then(print_number)
  await readLines('1').then(process_b).then(print_number)    
}

function process_a(data: string[]) {
  const numbers = data.map(s => parseInt(s))
  return numbers.reduce((t, n, i) => t + (n > numbers[i - 1] ? 1 : 0), 0)
}

function process_b(data: string[]) {
  const numbers = data.map(s => parseInt(s))
  return process_a(numbers.map((n, i) => `${n + numbers[i - 1] + numbers[i - 2]}`).slice(2))
}

run()