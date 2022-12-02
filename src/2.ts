import { readLines } from "./input"
import { print_number } from "./output"

async function run() {
  await readLines('2').then(process_a).then(print_number)
  await readLines('2').then(process_b).then(print_number)    
}

function process_a(data: string[]) {
  const r = data
    .map(c => c.split(' '))
    .map(c => ({a: c[0], v: parseInt(c[1])}))
    .reduce((a, c) => c.a === 'forward' ? [ a[0] + c.v, a[1] ] : 
                    ( c.a === 'up' ?      [ a[0], a[1] - c.v ] : 
                                          [ a[0], a[1] + c.v ]), [0, 0])
  return r[0] * r[1]
}

function process_b(data: string[]) {
  const r = data
    .map(c => c.split(' '))
    .map(c => ({a: c[0], v: parseInt(c[1])}))
    .reduce((a, c) => c.a === 'forward' ? [ a[0] + c.v, a[1] + c.v * a[2], a[2] ] : 
                    ( c.a === 'up' ?      [ a[0], a[1], a[2] - c.v ] : 
                                          [ a[0], a[1], a[2] + c.v ]), [0, 0, 0])
  return r[0] * r[1]
}

run()