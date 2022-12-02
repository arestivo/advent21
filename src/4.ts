import { readLines } from "./input"
import { print_number } from "./output"
import { range } from "./util"

type square = {
  number: string
  marked: boolean
}

type board = {
  rows : square[][]
  columns : square[][]
}

function readBoards(data: string[]) {
  const boards : board[] = []

  for (let b = 0; b < data.length/6; b++) {
    const board : board = { rows: [], columns: [] }
    const rows = data.slice(b * 6, (b + 1) * 6).slice(1).map(r => r.split(/ +/).filter(v => v !== ''))

    for (let r = 0; r < rows.length; r++) {
      board.rows.push([])

      for (let c = 0; c < rows[r].length; c++) {
        if (r == 0) board.columns.push([])
        board.rows[r].push({number: rows[r][c], marked: false})
        board.columns[c].push({number: rows[r][c], marked: false})
      }
    }

    boards.push(board)
  }

  return boards
}

async function run() {
  await readLines('4').then(process_a).then(print_number)
  await readLines('4').then(process_b).then(print_number)    
}

function process_a(data: string[]) {
  const drawn = data[0].split(',')
  const boards = readBoards(data.slice(1))

  for (const d of drawn) {
    for (const b of boards) {
      b.rows.forEach(r => r.forEach(v => { if (v.number === d) v.marked = true }))
      b.columns.forEach(r => r.forEach(v => { if (v.number === d) v.marked = true }))
      if (b.rows.filter(r => r.filter(v => !v.marked).length === 0).length > 0 || b.columns.filter(r => r.filter(v => !v.marked).length === 0).length > 0)
        return parseInt(d) * b.rows.reduce((s, r) => s + r.filter(v => !v.marked).reduce((s, v) => s + parseInt(v.number), 0), 0)
    }
  }

  return 0
}

function process_b(data: string[]) {
  const drawn = data[0].split(',')
  const boards = readBoards(data.slice(1))

  for (const d of drawn) {
    const active = boards.filter(b => b.rows.filter(r => r.filter(v => !v.marked).length === 0).length === 0 && b.columns.filter(r => r.filter(v => !v.marked).length === 0).length === 0)

    for (const b of active) {
      b.rows.forEach(r => r.forEach(v => { if (v.number === d) v.marked = true }))
      b.columns.forEach(r => r.forEach(v => { if (v.number === d) v.marked = true }))
    }

    const notwon = active.filter(b => b.rows.filter(r => r.filter(v => !v.marked).length === 0).length === 0 && b.columns.filter(r => r.filter(v => !v.marked).length === 0).length === 0)


    if (active.length === 1 && notwon.length === 0)
      return parseInt(d) * active[0].rows.reduce((s, r) => s + r.filter(v => !v.marked).reduce((s, v) => s + parseInt(v.number), 0), 0)
  }

  return 0
}

run()