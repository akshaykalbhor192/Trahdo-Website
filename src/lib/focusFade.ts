const clamp = (v: number, min: number, max: number) =>
  Math.max(min, Math.min(max, v))

/**
 * Text opacity: snaps quickly to 0 once scrolled past the focus line, but
 * stays dimly visible for a long stretch while still approaching it — a
 * quick exit, a long, readable preview on the way in.
 */
export function textOpacity(distance: number) {
  if (distance <= 0) {
    const exitRange = 160
    return clamp(1 - -distance / exitRange, 0, 1)
  }
  const dimFloor = 0.22
  const approachRange = 480
  const t = clamp(distance / approachRange, 0, 1)
  return 1 - t * (1 - dimFloor)
}

/** Image opacity: a tighter, symmetric falloff so exactly one (or two, mid-crossfade) stay lit. */
export function imageOpacity(distance: number) {
  const range = 280
  return clamp(1 - Math.abs(distance) / range, 0, 1)
}
