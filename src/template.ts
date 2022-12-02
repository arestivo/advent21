import { readLines } from "./input"
import { print_number } from "./output"

async function run() {
  await readLines('12', true).then(process_a).then(print_number)
  await readLines('12', true).then(process_b).then(print_number)    
}


function process_a(data: string[]) {
  return 0
}

function process_b(data: string[]) {
  return 0
}

run()