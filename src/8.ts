import { readLines } from "./input"
import { print_number } from "./output"

async function run() {
  await readLines('8').then(process_a).then(print_number)
  await readLines('8').then(process_b).then(print_number)    
}

function process_a(data: string[]) {
  let  count = 0

  for (const line of data) {
    const numbers = line.split(' | ')[1].split(' ')

    count += numbers.filter(n => [2, 3, 4, 7].includes(n.length)).length
  }

  return count
}

function process_b(data: string[]) {
  let count = 0

  for (const line of data) {
    const examples = line.split(' | ')[0].split(' ')
    const numbers = line.split(' | ')[1].split(' ')

    const found : string[] = Array(10).fill(undefined)

    found[1] = examples.filter(n => n.length === 2)[0]
    found[7] = examples.filter(n => n.length === 3)[0]
    found[4] = examples.filter(n => n.length === 4)[0]
    found[8] = examples.filter(n => n.length === 7)[0]

    found[2] = examples.filter(n => n.length === 5 && n.split('').filter(c => found[4].includes(c)).length === 2)[0]
    found[3] = examples.filter(n => n.length === 5 && n.split('').filter(c => found[7].includes(c)).length === 3)[0]
    found[5] = examples.filter(n => n.length === 5 && n !== found[2] && n !== found[3])[0]

    found[6] = examples.filter(n => n.length === 6 && n.split('').filter(c => found[1].includes(c)).length === 1)[0]
    found[9] = examples.filter(n => n.length === 6 && n.split('').filter(c => found[4].includes(c)).length === 4)[0]
    found[0] = examples.filter(n => n.length === 6 && n !== found[6] && n !== found[9])[0]

    count += parseInt(numbers.map(n => found.map(f => f.split('').sort().join()).indexOf(n.split('').sort().join())).join(''))
  }

  return count
}

run()