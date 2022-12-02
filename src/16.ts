import { readLine } from "./input"
import { print_number } from "./output"

async function run() {
  await readLine('16').then(process_a).then(print_number)
  await readLine('16').then(process_b).then(print_number)    
}

class Code {
  public binary = ''

  constructor() { 
  }

  from_hex(hex: string) {
    this.binary = hex.split('')
                     .map(h => parseInt(h, 16)
                     .toString(2)).map(b => {while (b.length < 4) b = '0' + b; return b})
                     .join('')
    return this
  }

  from_binary(binary: string) {
    this.binary = binary
    return this
  }

  read(n: number) {
    const data = this.binary.substring(0, n)
    this.binary = this.binary.slice(n)    
    return data
  }
}

class Packet {
  constructor(public version: number, public type: number) { }

  execute() { return 0 }

  print(level = 0) {}
}

class Literal extends Packet {
  constructor(version: number, public value: number) {
    super(version, 4)
  }  

  execute() { return this.value }

  print (level = 0) { 
    console.log(Array(level * 2).fill(' ').join(''), 'LITERAL', this.value)
  }
}

class Operator extends Packet {
  constructor(version: number, type: number, public subpackets: Packet[]) {
    super(version, type)
  }  

  execute() {
    switch (this.type) {
      case 0: return this.subpackets.reduce((v, p) => v + p.execute(), 0)  
      case 1: return this.subpackets.reduce((v, p) => v * p.execute(), 1)  
      case 2: return Math.min(...this.subpackets.map(p => p.execute()))  
      case 3: return Math.max(...this.subpackets.map(p => p.execute()))  
      case 5: return this.subpackets[0].execute() > this.subpackets[1].execute() ? 1 : 0
      case 6: return this.subpackets[0].execute() < this.subpackets[1].execute() ? 1 : 0
      case 7: return this.subpackets[0].execute() === this.subpackets[1].execute() ? 1 : 0
    }
    return 0
  }

  print(level: number = 0): void {
    console.log(Array(level * 2).fill(' ').join(''), 'OPERATOR', this.type, ` = ${this.execute()}`)
    for (const sp of this.subpackets)
     sp.print(level + 1)
  }
}

function parse_literal(version: number, code: Code) {
  let bits = ''

  while(true) {
    const part = code.read(5)
    bits += part.slice(1)
    if (part[0] === '0') break
  }

  return new Literal(version, parseInt(bits, 2))
}

function parse_operator(version: number, type: number, code: Code) : Operator {
  const id = code.read(1)
  const subpackets = []

  if (id === '0') {
    const length = parseInt(code.read(15), 2)
    const initial = code.binary.length
 
    while (code.binary.length > initial - length) subpackets.push(parse_packet(code))

  } else {
    const number = parseInt(code.read(11), 2)

    for (let i = 0; i < number; i++) subpackets.push(parse_packet(code))
  }

  return new Operator(version, type, subpackets)
}

function parse_packet(code: Code) {
  const version = parseInt(code.read(3), 2)  
  const type = parseInt(code.read(3), 2)

  if (type === 4) return parse_literal(version, code)
  else return parse_operator(version, type, code)
}

function add_versions(packet: Packet): number {
  if (packet instanceof Literal) return packet.version
  if (packet instanceof Operator) return packet.version + packet.subpackets.reduce((c, p) => c + add_versions(p), 0)
  return 0
}

function process_a(data: string) {
  const code = new Code().from_hex(data)

  const packet = parse_packet(code)

  return add_versions(packet)
}

function process_b(data: string) {
  const code = new Code().from_hex(data)

  const packet = parse_packet(code)

  return packet.execute()
}

run()