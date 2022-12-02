import { readLines } from "./input"
import { print_number } from "./output"

async function run() {
  await readLines('25').then(process_a).then(print_number)
  await readLines('25', true).then(process_b).then(print_number)    
}

function get(cucumbers: string[][], r: number, c: number) {
  if (r >= cucumbers.length) r = 0
  if (c >= cucumbers[0].length) c = 0
  return cucumbers[r][c]
}

function set(cucumbers: string[][], r: number, c: number, s: string) {
  if (r >= cucumbers.length) r = 0
  if (c >= cucumbers[0].length) c = 0
  cucumbers[r][c] = s
}

function step(cucumbers: string[][]) {
  const herd1 = cucumbers.map(r => r.map(c => c))

  for (const [r, row] of cucumbers.entries())
    for (const [c, cucumber] of row.entries())
      if (cucumber === '>' && get(cucumbers, r, c + 1) === '.') { set(herd1, r, c + 1, '>') ; set(herd1, r, c, '.') }

  const herd2 = herd1.map(r => r.map(c => c))

  for (const [r, row] of herd1.entries())
      for (const [c, cucumber] of row.entries())
        if (cucumber === 'v' && get(herd1, r + 1, c) === '.') { set(herd2, r + 1, c, 'v') ; set(herd2, r, c, '.') }

  return herd2
}

function process_a(data: string[]) {
  let cucumbers = data.map(r => r.split(''))
  let s = 0
  
  while(++s) {
    let next = step(cucumbers)
    if (JSON.stringify(next) === JSON.stringify(cucumbers)) return s
    cucumbers = next
  } 

  return 0
}

function process_b(data: string[]) {
  return 0
}

run()