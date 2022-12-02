import { readLine } from "./input"
import { print_number } from "./output"

async function run() {
  await readLine('6', true).then(process_a).then(print_number)
//  await readLine('6').then(process_b).then(print_number)    
}

function process_a(data: string, days = 18) {
  let fish = Array(8).fill(0)

  data.split(',').map(s => parseInt(s)).forEach(n => fish[n]++)

  for (let i = 0; i < days; i++) {
    const nf = fish[0]
    fish = fish.slice(1)
    fish[6] += nf
    fish.push(nf)
  }

  return fish.reduce((c, f) => c + f, 0)
}

function process_b(data: string) {
  return process_a(data, 256)
}

run()