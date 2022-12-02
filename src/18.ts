import { readLines } from "./input"
import { print_number } from "./output"

async function run() {
  await readLines('18').then(process_a).then(print_number)
  await readLines('18').then(process_b).then(print_number)    
}

function reduce(snailfish: string) {
  const regex = /\[\d+,\d+\]/g; let match
  while ((match = regex.exec(snailfish)) !== null) {
    const pair = match[0]
    const left = snailfish.substring(0, match.index)
    const right = snailfish.substring(match.index + pair.length)
    const level = (left.match(/\[/g)?.length || 0) - (left.match(/\]/g)?.length || 0)
    if (level >= 4) {
      
      const n1 = parseInt(pair.split(',')[0].match(/\d+/)![0])
      const n2 = parseInt(pair.split(',')[1].match(/\d+/)![0])
  
      const lpart = left.match(/[0-9]+(?!.*[0-9])/) ? left.replace(/[0-9]+(?!.*[0-9])/, `${parseInt(left.match(/[0-9]+(?!.*[0-9])/)![0], 10) + n1}`) : left
      const rpart = right.match(/[0-9]+/) ? right.replace(/[0-9]+/, `${parseInt(right.match(/[0-9]+/)![0], 10) + n2}`) : right
  
      return `${lpart}0${rpart}`
    }
  }

  const split = snailfish.match(/^(.*?)(\d{2,})(.*)$/)
  if (split) {
    const left = split[1]
    const value = parseInt(split[2], 10)
    const right = split[3]
    return `${left}[${Math.floor(value/2)},${Math.ceil(value/2)}]${right}`
  }

  return snailfish
}

function add_two(sn1: string, sn2: string) {
  return `[${sn1},${sn2}]`
}

function add(lines: string[]) {
  let current = lines[0]

  for (let i = 1; i < lines.length; i++) {
    current = add_two(current, lines[i])
    let previous = ''

    while (current !== previous) {
      previous = current
      current = reduce(current)
    }  
  }  

  return current
}

function calc(snailfish: string) {
  while(true) {
    const split = snailfish.match(/^(.*)\[(\d+),(\d+)\](.*)$/)
    if (split) {
      const left = split[1]
      const right = split[4]
      const n1 = parseInt(split[2], 10)
      const n2 = parseInt(split[3], 10)
      snailfish = `${left}${3 * n1 + 2 * n2}${right}`
    } else break  
  }
  return parseInt(snailfish, 10)
}

function process_a(data: string[]) {
  const result = add(data)
  const magnitude = calc(result)

  return magnitude
}

function process_b(data: string[]) {
  let best = 0
  for (let i = 0; i < data.length; i++)
    for (let j = 0; j < data.length; j++) {
      if (i === j) continue
      const sum = add([data[i], data[j]])
      const magnitude = calc(sum)
      best = Math.max(best, magnitude)
    }

  return best
}

run()