import { readLines } from "./input"
import { print_number } from "./output"

async function run() {
  await readLines('11').then(process_a).then(print_number)
  await readLines('11').then(process_b).then(print_number)    
}


function process_a(data: string[]) {
  const lines = data.map(r => r.split(''))
  let count = 0

  for (let s = 0; s < 100; s++) {
    let to_flash :{r: number, c: number}[] = []
    for (let r = 0; r < lines.length; r++)
      for (let c = 0; c < lines[r].length; c++) {
        if (lines[r][c] === '9') {
          to_flash.push({r, c})
          lines[r][c] = '*'
        } else lines[r][c] = `${parseInt(lines[r][c]) + 1}`
      }

    while(to_flash.length > 0) {
      const flash = to_flash[0]
      to_flash = to_flash.slice(1)

      for (let dx = -1; dx <= 1; dx++)
        for (let dy = -1; dy <= 1; dy++) {
          const r = flash.r + dy
          const c = flash.c + dx

          if (lines[r] !== undefined && lines[r][c] !== undefined && lines[r][c] !== '*') {
            if (lines[r][c] === '9') {
              to_flash.push({r, c})
              lines[r][c] = '*'
            } else lines[r][c] = `${parseInt(lines[r][c]) + 1}`
          }
        }
    }

    for (let r = 0; r < lines.length; r++)
      for (let c = 0; c < lines[r].length; c++) 
        if (lines[r][c] === '*') { lines[r][c] = '0'; count++ }
  }

  return count
}

function process_b(data: string[]) {
  const lines = data.map(r => r.split(''))
  let s = 1

  while(true) {
    let to_flash :{r: number, c: number}[] = []
    for (let r = 0; r < lines.length; r++)
      for (let c = 0; c < lines[r].length; c++) {
        if (lines[r][c] === '9') {
          to_flash.push({r, c})
          lines[r][c] = '*'
        } else lines[r][c] = `${parseInt(lines[r][c]) + 1}`
      }

    while(to_flash.length > 0) {
      const flash = to_flash[0]
      to_flash = to_flash.slice(1)

      for (let dx = -1; dx <= 1; dx++)
        for (let dy = -1; dy <= 1; dy++) {
          const r = flash.r + dy
          const c = flash.c + dx

          if (lines[r] !== undefined && lines[r][c] !== undefined && lines[r][c] !== '*') {
            if (lines[r][c] === '9') {
              to_flash.push({r, c})
              lines[r][c] = '*'
            } else lines[r][c] = `${parseInt(lines[r][c]) + 1}`
          }
        }
    }

    let count = 0
    for (let r = 0; r < lines.length; r++)
      for (let c = 0; c < lines[r].length; c++) 
        if (lines[r][c] === '*') { lines[r][c] = '0'; count++ }
    if (count === lines.length * lines[0].length) return s
    s++
  }
}

run()