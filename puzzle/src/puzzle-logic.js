/**
 * Jigsaw placement state: board[i] holds piece id i when solved, or null if empty.
 * All unplaced pieces live in tray (each id 0..n-1 appears once: on board or in tray).
 */

export function toRowCol(index, cols) {
  return { row: Math.floor(index / cols), col: index % cols };
}

export function shuffleInPlace(arr, randomFn = Math.random) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(randomFn() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * @param {number} cols
 * @param {number} rows
 * @param {() => number} [randomFn]
 */
export function createJigsawState(cols, rows, randomFn = Math.random) {
  const totalTiles = cols * rows;
  const board = Array.from({ length: totalTiles }, () => null);
  const tray = shuffleInPlace(
    Array.from({ length: totalTiles }, (_, i) => i),
    randomFn
  );

  return {
    cols,
    rows,
    totalTiles,
    board,
    tray,
    solved: false,
    moveCount: 0,
  };
}

export function checkWin(state) {
  for (let i = 0; i < state.totalTiles; i++) {
    if (state.board[i] !== i) return false;
  }
  return true;
}

/** Toddler mode: only the correct piece may enter a slot. */
export function canPlacePiece(state, pieceId, slotIndex) {
  if (slotIndex < 0 || slotIndex >= state.totalTiles) return false;
  if (state.board[slotIndex] !== null) return false;
  if (!state.tray.includes(pieceId)) return false;
  return pieceId === slotIndex;
}

export function placePiece(state, pieceId, slotIndex) {
  if (!canPlacePiece(state, pieceId, slotIndex)) return null;

  const board = [...state.board];
  const tray = state.tray.filter((id) => id !== pieceId);
  board[slotIndex] = pieceId;

  const next = {
    ...state,
    board,
    tray,
    moveCount: state.moveCount + 1,
  };

  if (checkWin(next)) {
    next.solved = true;
  }

  return next;
}

/** Background % for fragment of image for piece id (jigsaw cell shape). */
export function backgroundPercentForPiece(pieceId, cols, rows) {
  const { row, col } = toRowCol(pieceId, cols);
  const bgX = cols <= 1 ? 50 : (col / (cols - 1)) * 100;
  const bgY = rows <= 1 ? 50 : (row / (rows - 1)) * 100;
  return { bgX, bgY };
}

/** Deterministic PRNG for tests (mulberry32). */
export function createSeededRandom(seed) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}
