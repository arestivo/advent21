import { readLines } from "./input"
import { print_number } from "./output"
import Heap from "heap"
import { exit } from "process"

async function run() {
  await readLines('23b').then(process_b).then(print_number)
}

class Amphipod {
  constructor(public type: number, public r: number, public c: number) { }

  get char() { return String.fromCharCode('A'.charCodeAt(0) + this.type) }
  get cost() { return Math.pow(10, this.type) }
  get home() { return 2 + this.type * 2 }

  is_at_home(state: state) {
    return (this.r > 0 && this.c === this.home && !state.pods.some(p => p.c === this.c && p.type !== this.type && p.r > this.r))
  }

  is_on_top(state: state) {
    return (this.r > 0 && !state.pods.some(p => p.c === this.c && p.r < this.r))    
  }

  is_on_corridor() {
    return this.r === 0
  }

  home_is_empty(state: state) {
    return !state.pods.some(p => p.c === this.home && p.c !== p.home)
  }
}

function to_string(pods: Amphipod[]) {
  const chars = []
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 11; c++) {
      const pod = pods.filter(p => p.r === r && p.c === c)[0]
      if (pod) chars.push(pod.char) 
      else chars.push(r === 0 ? '.' : (c % 2 === 0 ? (c === 0 || c === 10 ? ' ' : '.') : '#'))
    }
  }
  return chars.join('')
}

function print (pods: Amphipod[]) {
  for (let r = 0; r < 5; r++) {
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

function can_stop(c: number) {
  return c < 2 || c > 8 || c % 2 === 1
}

function exit_left(state: state, n: number, stack: Heap<state>) {
  const pod = state.pods[n]
  while (pod.r > 0) { pod.r-- ; state.cost += pod.cost }
  while (pod.c > 0) {
    pod.c-- ; state.cost += pod.cost
    if (state.pods.some(p => p !== pod && p.r === 0 && p.c === pod.c)) return 
    if (can_stop(pod.c)) add_to_stack(stack, state)
  }
}

function exit_right(state: state, n: number, stack: Heap<state>) {
  const pod = state.pods[n]
  while (pod.r > 0) { pod.r-- ; state.cost += pod.cost }
  while (pod.c < 10) {
    pod.c++ ; state.cost += pod.cost
    if (state.pods.some(p => p !== pod && p.r === 0 && p.c === pod.c)) return 
    if (can_stop(pod.c)) add_to_stack(stack, state)
  }
}

function move_home(state: state, n: number, stack: Heap<state>) {
  const pod = state.pods[n]
  
  while (pod.c !== pod.home) { 
    if (pod.home > pod.c) pod.c++; 
    else pod.c--; 
    if (state.pods.some(p => p !== pod && p.r === 0 && p.c === pod.c)) return 
    state.cost += pod.cost 
  }
  
  while (pod.r < 4 && !state.pods.some(p => p.c === pod.c && p.r === pod.r + 1)) {
    pod.r++
    state.cost += pod.cost 
  }

  if (!pod.is_on_corridor()) add_to_stack(stack, state)
}

function add_to_stack(stack: Heap<state>, state: state) {
  stack.push(clone(state))
}

function clone (state: state) {
  return { pods: state.pods.map(p => new Amphipod(p.type, p.r, p.c)), cost: state.cost }
}

type state = { pods: Amphipod[], cost: number }

const visited: Map<string, number> = new Map

function solve(pods: Amphipod[]) {
  const stack : Heap<state> = new Heap((s1, s2) => s1.cost - s2.cost)
  stack.push({ pods, cost: 0})

  while (!stack.empty()) {
    const state = stack.pop()

    if (state.pods.every(p => p.is_at_home(state))) return state.cost

    if ((visited.get(to_string(state.pods)) || 1000000) <= state.cost) continue
    visited.set(to_string(state.pods), state.cost)

    for (const [n,pod] of state.pods.entries()) {
      if (!pod.is_at_home(state) && pod.is_on_top(state)) {
        exit_left(clone(state), n, stack)
        exit_right(clone(state), n, stack)
      }

      if (pod.is_on_corridor() && pod.home_is_empty(state)) {
        move_home(clone(state), n, stack)      
      }
    }

    console.log(state.cost)
    print(state.pods)
  }

  return -1
}

function process_b(data: string[]) {
  const pods: Amphipod[] = []

  data[2].split('#').filter(c => c.trim() !== '').forEach((c, i) => pods.push(new Amphipod(c.charCodeAt(0) - 'A'.charCodeAt(0), 1, 2 + i * 2)))
  data[3].split('#').filter(c => c.trim() !== '').forEach((c, i) => pods.push(new Amphipod(c.charCodeAt(0) - 'A'.charCodeAt(0), 2, 2 + i * 2)))
  data[4].split('#').filter(c => c.trim() !== '').forEach((c, i) => pods.push(new Amphipod(c.charCodeAt(0) - 'A'.charCodeAt(0), 3, 2 + i * 2)))
  data[5].split('#').filter(c => c.trim() !== '').forEach((c, i) => pods.push(new Amphipod(c.charCodeAt(0) - 'A'.charCodeAt(0), 4, 2 + i * 2)))

  return solve(pods)
}

run()