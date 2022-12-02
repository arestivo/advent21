import { readLines } from "./input"
import { print_number } from "./output"
import { range } from "./util"

async function run() {
  await readLines('3').then(process_a).then(print_number)
  await readLines('3').then(process_b).then(print_number)    
}

function process_a(data: string[]) {
  const counts = range(data[0].length).map(i => data.reduce((c, d) => c + (d[i] === '1' ? 1 : 0), 0))
  const gama = counts.map(c => c > data.length / 2 ? '1' : '0').join('')
  const epsilon = counts.map(c => c > data.length / 2 ? '0' : '1').join('')

  return parseInt(gama, 2) * parseInt(epsilon, 2)
}

function process_b(data: string[]) {
  const r = range(data[0].length).reduce((a, i) => [
      a[0].length === 1 ? a[0] : a[0].filter(o => o[i] === (a[0].reduce((c, d) => c + (d[i] === '1' ? 1 : 0), 0) >= a[0].length / 2 ? '1' : '0')),
      a[1].length === 1 ? a[1] : a[1].filter(o => o[i] === (a[1].reduce((c, d) => c + (d[i] === '1' ? 1 : 0), 0) < a[1].length / 2 ? '1' : '0'))
    ]
  , [data, data])
  

  return parseInt(r[0][0], 2) * parseInt(r[1][0], 2)
}

run()