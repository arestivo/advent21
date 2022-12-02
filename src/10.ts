import { readLines } from "./input"
import { print_number } from "./output"

async function run() {
  await readLines('10').then(process_a).then(print_number)
  await readLines('10').then(process_b).then(print_number)    
}

const open = ['(', '[', '{', '<']
const close = [')', ']', '}', '>']
const points = [3, 57, 1197, 25137]

function corruption_score(line: string) {
  const stack : string[] = []

  for (let i = 0; i < line.length; i++) {
    const c = line[i]
    if (open.includes(c)) stack.push(c)
    if (close.includes(c)) {
      const o = stack.pop() || ''
      if (open.indexOf(o) !== close.indexOf(c)) return points[close.indexOf(c)]
    }
  }

  return 0
}

function missing_closing(line: string) {
  const stack : string[] = []

  for (let i = 0; i < line.length; i++) {
    const c = line[i]
    if (open.includes(c)) stack.push(c)
    if (close.includes(c)) stack.pop()
  }

  return stack
}

function process_a(data: string[]) {
  return data.reduce((s, l) => s + corruption_score(l), 0)
}

function process_b(data: string[]) {
  let scores = []

  for (const line of data) {
    if (corruption_score(line) === 0) {
      const stack = missing_closing(line).reverse()
      scores.push(stack.reduce((s, c) => s * 5 + open.indexOf(c) + 1, 0))
    }
  }

  scores.sort((a, b) => b - a)
  console.log(scores)

  return scores[Math.floor(scores.length / 2)]
}

run()