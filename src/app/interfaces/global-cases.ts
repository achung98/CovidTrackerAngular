interface Cases {
  num: number,
  diff?: number,
  rate?: number
}

interface Current extends Cases {
  latest_update: string
}

export { Cases, Current }
