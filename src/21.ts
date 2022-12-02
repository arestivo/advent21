import { readLines } from "./input"
import { print_number } from "./output"

async function run() {
  await readLines('21').then(process_a).then(print_number)
  await readLines('21').then(process_b).then(print_number)    
}

class Player {
  score: number = 0

  constructor (public position: number) { }
}

class Die {
  next: number = 1
  times: number = 0

  constructor (public sides: number = 100) { }

  roll() {
    const value = this.next
    this.next++
    this.times++
    if (this.next > 100) this.next = 1
    return value
  }
}

function process_a(data: string[]) {
  const p1 = new Player(parseInt(data[0].split(':')[1], 10))
  const p2 = new Player(parseInt(data[1].split(':')[1], 10))
  const die = new Die()

  let to_play = 0
  while (p1.score < 1000 && p2.score < 1000) {
    if (to_play === 0) {
      p1.position += die.roll() + die.roll() + die.roll()
      p1.position = ((p1.position - 1) % 10) + 1
      p1.score += p1.position
    }
    if (to_play === 1) {
      p2.position += die.roll() + die.roll() + die.roll()
      p2.position = ((p2.position - 1) % 10) + 1
      p2.score += p2.position
    }
    to_play = 1 - to_play
  }

  if (p1.score >= 1000) return p2.score * die.times 
  else return p1.score * die.times
}

type state = { tp: number, p1: number, p2: number, s1: number, s2: number }
type result = { t1: number, t2: number }

const mem: Map<string, string> = new Map
const ways: Map<number, number> = new Map

function move (p: number, n: number) {
  return ((p + n) - 1) % 10 + 1
}

function quantum(s: state) : result { 
  if (s.s1 >=21) return { t1: 1, t2: 0 }
  if (s.s2 >=21) return { t1: 0, t2: 1 }

  if (mem.has(JSON.stringify(s))) return JSON.parse(mem.get(JSON.stringify(s)) || '')

  let total = {t1: 0, t2: 0}

  if (s.tp === 0)
    for (let r = 3; r <= 9; r++) {
      const result = quantum({ tp: 1 - s.tp, p1: move(s.p1, r), p2: s.p2, s1: s.s1 + move(s.p1, r), s2: s.s2 }) 
      total.t1 += result.t1 * (ways.get(r) || 0)
      total.t2 += result.t2 * (ways.get(r) || 0)
    }
  else
    for (let r = 3; r <= 9; r++) {
      const result = quantum({ tp: 1 - s.tp, p1: s.p1, p2: move(s.p2, r), s1: s.s1, s2: s.s2  + move(s.p2, r) }) 
      total.t1 += result.t1 * (ways.get(r) || 0)
      total.t2 += result.t2 * (ways.get(r) || 0)
    }

  mem.set(JSON.stringify(s), JSON.stringify(total))
  return total
}

function process_b(data: string[]) {
  const p1 = parseInt(data[0].split(':')[1], 10)
  const p2 = parseInt(data[1].split(':')[1], 10)

  for (let d1 = 1; d1 <= 3; d1++)
  for (let d2 = 1; d2 <= 3; d2++)
  for (let d3 = 1; d3 <= 3; d3++)
  ways.set(d1 + d2 + d3, (ways.get(d1 + d2 + d3) || 0) + 1)

  const r = quantum({tp: 0, p1, p2, s1: 0, s2: 0})

  return Math.max(r.t1, r.t2)
}

run()