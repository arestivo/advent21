export function range (n: number){
  return Array.from(Array(n).keys()).map((_, i) => i)
}