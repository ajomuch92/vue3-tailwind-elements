/**
 * Index `step` places away from `from`, wrapping at both ends and skipping
 * whatever `skip` rejects — the move every arrow-key list in here makes.
 *
 * Returns `from` when nothing else is reachable, so a list of entirely
 * disabled items cannot spin forever.
 */
export function stepIndex(
  from: number,
  step: number,
  length: number,
  skip: (index: number) => boolean = () => false
): number {
  if (length === 0) return -1;
  let index = from;
  for (let moved = 0; moved < length; moved += 1) {
    index = (((index + step) % length) + length) % length;
    if (!skip(index)) return index;
  }
  return from;
}

/** First index `skip` accepts, searching from `from` towards the end (or the start). */
export function edgeIndex(
  length: number,
  step: 1 | -1,
  skip: (index: number) => boolean = () => false
): number {
  for (let i = 0; i < length; i += 1) {
    const index = step === 1 ? i : length - 1 - i;
    if (!skip(index)) return index;
  }
  return -1;
}
