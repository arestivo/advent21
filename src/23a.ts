import { readLines } from "./input"
import { print_number } from "./output"
import Heap from "heap"

async function run() {
  await readLines('23a').then(process_a).then(print_number)
}

class Amphipod {
  constructor(public type: number, public r: number, public c: number) { }

  get char() { return String.fromCharCode('A'.charCodeAt(0) + this.type) }
  get cost() { return Math.pow(10, this.type) }
  get home() { return 2 + this.type * 2 }

  is_at_home(others: Amphipod[]) {
    if (this.r === 0) return false
    if (this.c !== this.home) return false
    if (this.r === 2) return true
    return !others.some(o => o.r === 2 && o.char !== this.char && o.c === this.c)
  }

  is_at_any_home() {
    return this.r !== 0
  }

  is_at_corridor() {
    return this.r === 0
  }

  is_clear(others: Amphipod[], r: number, c: number) {
    return !others.some(o => o.r === r && o.c === c)
  }

  home_is_left() {
    return this.r === 0 && this.c - 1 === this.home    
  }

  home_is_right() {
    return this.r === 0 && this.c + 1 === this.home    
  }

  move_left(others: Amphipod[]) {
    if (this.r === 0) {
      if ((this.c === 1 || this.c === 10) && this.is_clear(others, 0, this.c - 1)) {
        this.c--
        return this.cost
      }  

      if (this.c > 1 && this.c < 10 && this.is_clear(others, 0, this.c - 1) && this.is_clear(others, 0, this.c - 2)) {
        this.c -= 2
        return this.cost * 2
      }  
    }
    return 0
  }

  move_right(others: Amphipod[]) {
    if (this.r === 0) {
      if ((this.c === 0 || this.c === 9) && this.is_clear(others, 0, this.c + 1)) {
        this.c++
        return this.cost
      }  

      if (this.c > 0 && this.c < 9 && this.is_clear(others, 0, this.c + 1) && this.is_clear(others, 0, this.c + 2)) {
        this.c += 2
        return this.cost * 2
      }  
    }
    return 0
  }

  exit_left(others: Amphipod[]) {

    if (this.r == 1 && this.is_clear(others, 0, this.c - 1)) { 
      this.c--
      this.r = 0
      return this.cost * 2 
    }

    if (this.r == 2 && this.is_clear(others, 1, this.c) && this.is_clear(others, 0, this.c - 1)) { 
      this.c--
      this.r = 0
      return this.cost * 3 
    }

    return 0
  }

  exit_right(others: Amphipod[]) {
    if (this.r == 1 && this.is_clear(others, 0, this.c + 1)) { 
      this.c++
      this.r = 0
      return this.cost * 2 
    }

    if (this.r == 2 && this.is_clear(others, 1, this.c) && this.is_clear(others, 0, this.c + 1)) { 
      this.c++
      this.r = 0
      return this.cost * 3 
    }

    return 0
  }

  move_home_left(others: Amphipod[]) {
    if (!others.some(o => o.c === this.c - 1)) {
      this.c--
      this.r = 2
      return this.cost * 3
    }
    if (!others.some(o => o.c === this.c - 1 && o.char !== this.char)) {
      this.c--
      this.r = 1
      return this.cost * 2
    }
    return 0
  }

  move_home_right(others: Amphipod[]) {
    if (!others.some(o => o.c === this.c + 1)) {
      this.c++
      this.r = 2
      return this.cost * 3
    }
    if (!others.some(o => o.c === this.c + 1 && o.char !== this.char)) {
      this.c++
      this.r = 1
      return this.cost * 2
    }
    return 0
  }
}

function print (pods: Amphipod[]) {
  for (let r = 0; r < 3; r++) {
    const chars = []
    for (let c = 0; c < 11; c++) {
      const pod = pods.filter(p => p.r === r && p.c === c)[0]
      if (pod) chars.push(pod.char) 
      else chars.push(r === 0 ? '.' : (c % 2 === 0 ? (c === 0 || c === 10 ? ' ' : '.') : '#'))
    }
    console.log(chars.join(''))
  }
  console.log()
}

type state = { pods: Amphipod[], cost: number, path: string[] }

const visited: Map<string, number> = new Map

function solve(pods1: Amphipod[]) {
  const stack : Heap<state> = new Heap((s1, s2) => s1.cost - s2.cost)
  stack.push({ pods: pods1, cost: 0, path: []})

  while (!stack.empty()) {
    const state = stack.pop()

    if (state.pods.every(p => p.is_at_home(state.pods))) {
      for (const p of state.path)
        print(JSON.parse(p).map((a: Amphipod) => new Amphipod(a.type, a.r, a.c)))

      return state.cost
    }

    for (const [i, pod] of state.pods.entries()) {
      if (pod.is_at_home(state.pods)) continue
      if (pod.home_is_left()) {
        const copy = state.pods.map(p => new Amphipod(p.type, p.r, p.c))
        const cost = copy[i].move_home_left(copy)
        if (cost > 0 && !state.path.includes(JSON.stringify(copy)) && (visited.get(JSON.stringify(copy)) || 1000000) > state.cost + cost) {
          stack.push({ pods: copy, cost: state.cost + cost, path: state.path.concat(JSON.stringify(copy)) })
          visited.set(JSON.stringify(copy), state.cost + cost)
        }
      }
      if (pod.home_is_right()) {
        const copy = state.pods.map(p => new Amphipod(p.type, p.r, p.c))
        const cost = copy[i].move_home_right(copy)
        if (cost > 0 && !state.path.includes(JSON.stringify(copy)) && (visited.get(JSON.stringify(copy)) || 1000000) > state.cost + cost) {
          stack.push({ pods: copy, cost: state.cost + cost, path: state.path.concat(JSON.stringify(copy)) })
          visited.set(JSON.stringify(copy), state.cost + cost)
        }
      }
      if (!pod.is_at_home(state.pods) && pod.is_at_any_home()) {
        const copy_left = state.pods.map(p => new Amphipod(p.type, p.r, p.c))
        const cost_left = copy_left[i].exit_left(copy_left)
        if (cost_left > 0 && !state.path.includes(JSON.stringify(copy_left)) && (visited.get(JSON.stringify(copy_left)) || 1000000) > state.cost + cost_left) {
          stack.push({ pods: copy_left, cost: state.cost + cost_left, path: state.path.concat(JSON.stringify(copy_left)) })
          visited.set(JSON.stringify(copy_left), state.cost + cost_left)
        }
  
        const copy_right = state.pods.map(p => new Amphipod(p.type, p.r, p.c))
        const cost_right = copy_right[i].exit_right(copy_right)
        if (cost_right > 0 && !state.path.includes(JSON.stringify(cost_right)) && (visited.get(JSON.stringify(copy_right)) || 1000000) > state.cost + cost_right) {
          stack.push({ pods: copy_right, cost: state.cost + cost_right, path: state.path.concat(JSON.stringify(copy_right)) })
          visited.set(JSON.stringify(copy_right), state.cost + cost_right)
        }
      }
      if (pod.is_at_corridor()) {
        const copy_left = state.pods.map(p => new Amphipod(p.type, p.r, p.c))
        const cost_left = copy_left[i].move_left(copy_left)
        if (cost_left > 0 && !state.path.includes(JSON.stringify(copy_left)) && (visited.get(JSON.stringify(copy_left)) || 1000000) > state.cost + cost_left) {
          stack.push({ pods: copy_left, cost: state.cost + cost_left, path: state.path.concat(JSON.stringify(copy_left)) })
          visited.set(JSON.stringify(copy_left), state.cost + cost_left)
        }

        const copy_right = state.pods.map(p => new Amphipod(p.type, p.r, p.c))
        const cost_right = copy_right[i].move_right(copy_right)
        if (cost_right > 0 && !state.path.includes(JSON.stringify(cost_right)) && (visited.get(JSON.stringify(copy_right)) || 1000000) > state.cost + cost_right) {
          stack.push({ pods: copy_right, cost: state.cost + cost_right, path: state.path.concat(JSON.stringify(copy_right)) })
          visited.set(JSON.stringify(copy_right), state.cost + cost_right)
        }
      }  
    }

  }

  return -1
}

function process_a(data: string[]) {
  const pods: Amphipod[] = []

  data[2].split('#').filter(c => c.trim() !== '').forEach((c, i) => pods.push(new Amphipod(c.charCodeAt(0) - 'A'.charCodeAt(0), 1, 2 + i * 2)))
  data[3].split('#').filter(c => c.trim() !== '').forEach((c, i) => pods.push(new Amphipod(c.charCodeAt(0) - 'A'.charCodeAt(0), 2, 2 + i * 2)))

  return solve(pods)
}

run()