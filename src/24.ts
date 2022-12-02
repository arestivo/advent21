import { exit } from "process";
import { readLines } from "./input"
import { print_number } from "./output"

async function run() {
  await readLines('24').then(process_a).then(print_number)
  await readLines('24').then(process_b).then(print_number)    
}

class Memory {
  constructor(public x: number, public y: number, public w: number, public z: number, public path: string) {}
  
  set(a: string, b: number) {
    switch (a) {
      case 'x': this.x = Math.trunc(b); break
      case 'y': this.y = Math.trunc(b); break
      case 'w': this.w = Math.trunc(b); break
      case 'z': this.z = Math.trunc(b); break
      default: throw new Error("Set to Unknown Memory Location")
    }
    return this
  }

  get(a: string) {
    switch (a) {
      case 'x': return this.x
      case 'y': return this.y
      case 'w': return this.w
      case 'z': return this.z
      default: return parseInt(a, 10)
    }
  }

  clone() {
    return new Memory(this.x, this.y, this.w, this.z, this.path)
  }
}

abstract class Operation {
  abstract execute(alu: ALU, mem: Memory) : void
}

class Inp extends Operation {
  constructor(public a : string) { 
    super()
  }

  execute(alu: ALU, mem: Memory): void {
    if (alu.input.length === 0) throw new Error('Input Exhausted')
    const n = parseInt(alu.input[0], 10)
    alu.input = alu.input.slice(1)
    mem.set(this.a, n)
  }
}

class Add extends Operation {
  constructor(public a : string, public b : string) { 
    super()
  }

  execute(_: ALU, mem: Memory): void {
    mem.set(this.a, mem.get(this.a) + mem.get(this.b))
  }
}

class Mul extends Operation {
  constructor(public a : string, public b : string) { 
    super()
  }

  execute(_: ALU, mem: Memory): void {
    mem.set(this.a, mem.get(this.a) * mem.get(this.b))
  }
 
}

class Div extends Operation {
  constructor(public a : string, public b : string) { 
    super()
  }

  execute(_: ALU, mem: Memory): void {
    const b = mem.get(this.b)
    if (b === 0) throw new Error("Division by Zero")
    mem.set(this.a, mem.get(this.a) / b)
  }

}

class Mod extends Operation {
  constructor(public a : string, public b : string) { 
    super()
  }

  execute(_: ALU, mem: Memory): void {
    const b = mem.get(this.b)
    if (b === 0) throw new Error("Division by Zero")
    mem.set(this.a, mem.get(this.a) % b)
  }
}

class Eql extends Operation {
  constructor(public a : string, public b : string) { 
    super()
  }

  execute(_: ALU, mem: Memory): void {
    mem.set(this.a, mem.get(this.a) === mem.get(this.b) ? 1 : 0)
  }
}

class ALU {
  public mem = [ new Memory(0, 0, 0, 0, '') ] 
  input :string = ''

  constructor(public operations: Operation[], private maximize: boolean) {}

  run(input: string = '') {
    this.mem = [ new Memory(0, 0, 0, 0, input) ]
    this.input = input

    for (const op of this.operations) {
      if (op instanceof Inp && input === '') this.branch()
      else for (const m of this.mem) op.execute(this, m)
    }
  }

  branch() {
    const zs = new Map<number, string>()

    if (this.maximize) this.mem.forEach(m => (!zs.has(m.z) || (parseInt(zs.get(m.z)!, 10) < parseInt(m.path, 10))) ? zs.set(m.z, m.path) : 0)
    else this.mem.forEach(m => (!zs.has(m.z) || (parseInt(zs.get(m.z)!, 10) > parseInt(m.path, 10))) ? zs.set(m.z, m.path) : 0)

    this.mem = []

    for (const z of zs.entries()) {
      if (z[0] <= Math.pow(26, 4))
      for (let i = 1; i < 10; i++) {
        this.mem.push(new Memory(0, 0, i, z[0], z[1] + `${i}`))
      }  
    }
  }
}

function process_a(data: string[]) {
  const operations = data.map(d => {
    const [op, a, b] = d.split(' ')
    switch (op) {
      case 'inp': return new Inp(a)
      case 'add': return new Add(a, b)
      case 'mul': return new Mul(a, b)
      case 'div': return new Div(a, b)
      case 'mod': return new Mod(a, b)
      case 'eql': return new Eql(a, b)
      default: throw new Error("Unknown Operation")
    }
  })

  const alu = new ALU(operations, true)
  alu.run()

  const r = Math.max(...alu.mem.filter(m => m.z === 0).map(m => parseInt(m.path, 10)))
  return r
}

function process_b(data: string[]) {
  const operations = data.map(d => {
    const [op, a, b] = d.split(' ')
    switch (op) {
      case 'inp': return new Inp(a)
      case 'add': return new Add(a, b)
      case 'mul': return new Mul(a, b)
      case 'div': return new Div(a, b)
      case 'mod': return new Mod(a, b)
      case 'eql': return new Eql(a, b)
      default: throw new Error("Unknown Operation")
    }
  })

  const alu = new ALU(operations, false)
  alu.run()

  const r = Math.min(...alu.mem.filter(m => m.z === 0).map(m => parseInt(m.path, 10)))
  return r
}

run()