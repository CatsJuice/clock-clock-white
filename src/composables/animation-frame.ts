export type TickCallback = (elapsed: number) => void

const ticks = new Set<TickCallback>()

let initial = false
let prevTime = 0
let fpsLimit = 144

function frame() {
  const now = Date.now()
  const elapsed = now - prevTime
  if (elapsed < 1000 / fpsLimit)
    return requestAnimationFrame(frame)

  for (const tick of ticks)
    tick(elapsed)
  prevTime = Date.now()
  requestAnimationFrame(frame)
}

export function useAnimationFrame(opts?: {
  fpsLimit?: number
}) {
  if (opts?.fpsLimit)
    fpsLimit = opts.fpsLimit

  const privateTicks = new Set<TickCallback>()

  function addTick(
    tick: TickCallback,
  ) {
    privateTicks.add(tick)
    ticks.add(tick)
  }

  function removeTick(tick: TickCallback) {
    privateTicks.delete(tick)
    ticks.delete(tick)
  }

  function updateFpsLimit(limit: number) {
    fpsLimit = limit
  }

  onBeforeUnmount(() => {
    for (const tick of privateTicks)
      ticks.delete(tick)
  })

  if (!initial) {
    initial = true
    prevTime = Date.now()
    requestAnimationFrame(frame)
  }

  return { addTick, removeTick, updateFpsLimit }
}
