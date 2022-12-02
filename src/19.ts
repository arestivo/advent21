import { readLines } from "./input"
import { print_number } from "./output"

async function run() {
  await readLines('19').then(process_a).then(print_number)
  await readLines('19').then(process_b).then(print_number)    
}

function multiply(m1: number[][], m2: number[][]) {
  const result: number[][] = []
  for (let i = 0; i < m1.length; i++) {
      result[i] = []
      for (let j = 0; j < m2[0].length; j++) {
          let sum = 0
          for (var k = 0; k < m1[0].length; k++)
              sum += m1[i][k] * m2[k][j];
          result[i][j] = sum
      }
  }
  return result
}

class Point {
  constructor(public x: number, public y: number, public z: number) {}

  distance(other: Point): Point {
    return new Point(other.x - this.x, other.y - this.y, other.z - this.z)
  }
}

class Rotation {

  constructor (public matrix: number[][] = [[1, 0, 0], [0, 1, 0], [0, 0, 1]]) { }

  static generate() : Rotation[] {
    const rotations = []
    
    let current = new Rotation
    
    for(let i = 0; i < 2; i++) {
      for(let j = 0; j < 3; j++) {
        current = current.roll()
        rotations.push(current)
        for(let k = 0; k < 3; k++) {
          current = current.turn()
          rotations.push(current)
        }
      }
      current = current.roll().turn().roll()
    }

    return rotations
  }

  turn(): Rotation {
    return new Rotation(multiply(this.matrix, [[1, 0, 0], [0, 0, -1], [0, 1, 0]]))
  }

  roll(): Rotation {
    return new Rotation(multiply(this.matrix, [[0, 0, 1], [0, 1, 0], [-1, 0, 0]]))
  }

  rotate(p: Point) {
    const m = multiply([[p.x, p.y, p.z]], this.matrix)
    return new Point(m[0][0], m[0][1], m[0][2])
  }
}

class Scanner {
  beacons: Beacon[] = []
  rotation: Rotation | undefined = undefined
  location: Point | undefined = undefined

  constructor(public id: number) { }

  get real_beacons() {
    if (this.rotation === undefined || this.location === undefined) return []
    return this.beacons.map(b => new Beacon(this.location!.distance(this.rotation!.rotate(b.location))))
  }

  conciliate(other: Scanner) {
    for (const r of Rotation.generate()) {
      const dist: Map<string, number> = new Map

      other.location = this.location
      other.rotation = r

      this.real_beacons.forEach(b1 => other.real_beacons.forEach(b2 => {
        const d = b1.location.distance(b2.location)
        dist.set(JSON.stringify(d), (dist.get(JSON.stringify(d)) || 0) + 1)
      }))

      for (const [p, c] of Array.from((dist.entries()))) {
        if (this.location && c >= 12) {
          const point: Point = JSON.parse(p)
          other.location = new Point(-point.x, -point.y, -point.z).distance(this.location)
          return true
        }
      }
    }

    other.location = undefined
    other.rotation = undefined

    return false
  }
}

class Beacon {
  constructor(public location: Point) { }  
}

function init_scanners(data: string[]) {
  const scanners = []

  for (const line of data) {
    if (line.startsWith('---')) scanners.push(new Scanner(scanners.length))
    if (line.startsWith('---') || line.trim() === '') continue
    const coords = line.split(',').map(c => parseInt(c, 10))
    scanners[scanners.length - 1].beacons.push(new Beacon(new Point(coords[0], coords[1], coords[2])))
  }

  scanners[0].location = new Point(0, 0, 0)
  scanners[0].rotation = new Rotation()

  return scanners
}

function conciliate_scanners(scanners: Scanner[]) {
  while (true) {
    const done = scanners.filter(s => s.location !== undefined)
    const remaining = scanners.filter(s => s.location === undefined)
    if (remaining.length === 0) break

    for (const r of remaining) for (const d of done) if (d.conciliate(r)) break
  }

  return scanners
}

function process_a(data: string[]) {
  const scanners = conciliate_scanners(init_scanners(data))
  return new Set(scanners.flatMap(s => s.real_beacons.map(b => JSON.stringify(b)))).size
}

function process_b(data: string[]) {
  const scanners = conciliate_scanners(init_scanners(data))

  let best = 0
  for (const s1 of scanners)
    for (const s2 of scanners) {
      const dist = Math.abs(s1.location!.x - s2.location!.x) + Math.abs(s1.location!.y - s2.location!.y) + Math.abs(s1.location!.z - s2.location!.z)
      best = Math.max(dist, best)
    }

  return best
}

run()