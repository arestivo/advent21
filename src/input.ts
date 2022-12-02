import { readFile } from "fs/promises";

export async function readLines(n: string, sample: boolean = false) : Promise<string[]> {
  const filename = `data/${n}.${sample ? 'sample' : 'in'}`
  return (await readFile(filename, {encoding: 'utf-8'})).split('\n')
}

export async function readLine(n: string, sample: boolean = false) : Promise<string> {
  return (await readLines(n, sample))[0]
}