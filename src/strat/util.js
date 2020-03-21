import * as cg from './types';

export const colors = ['white', 'black'];

export const invRanks = [8, 7, 6, 5, 4, 3, 2, 1];

export const allKeys = Array.prototype.concat(...cg.files.map(c => cg.ranks.map(r => c+r)));

export const pos2key = (pos) => allKeys[8 * pos[0] + pos[1] - 9];

export const key2pos = (k) => [k.charCodeAt(0) - 96, k.charCodeAt(1) - 48];

export function memo(f) {
  let v;
  const ret = () => {
    if (v === undefined) v = f();
    return v;
  };
  ret.clear = () => { v = undefined; };
  return ret;
}

export const timer = () => {
  let startAt;
  return {
    start() { startAt = performance.now(); },
    cancel() { startAt = undefined; },
    stop() {
      if (!startAt) return 0;
      const time = performance.now() - startAt;
      startAt = undefined;
      return time;
    }
  };
}

export const opposite = (c) => c === 'white' ? 'black' : 'white';

export function containsX(xs, x) {
  return xs !== undefined && xs.indexOf(x) !== -1;
}

export const distanceSq = (pos1, pos2) => {
  return Math.pow(pos1[0] - pos2[0], 2) + Math.pow(pos1[1] - pos2[1], 2);
};

export const samePiece = (p1, p2) =>
  p1.role === p2.role && p1.color === p2.color;

const posToTranslateBase = (pos, asWhite, xFactor, yFactor) => [
  (asWhite ? pos[0] - 1 : 8 - pos[0]) * xFactor,
  (asWhite ? 8 - pos[1] : pos[1] - 1) * yFactor
];

export const posToTranslateAbs = (bounds) => {
  const xFactor = bounds.width / 8,
  yFactor = bounds.height / 8;
  return (pos, asWhite) => posToTranslateBase(pos, asWhite, xFactor, yFactor);
};

export const posToTranslateRel =
  (pos, asWhite) => posToTranslateBase(pos, asWhite, 100, 100);

// touchend has no position!
export const eventPosition = e => {
  if (e.clientX || e.clientX === 0) return [e.clientX, e.clientY];
  if (e.touches && e.targetTouches[0]) return [e.targetTouches[0].clientX, e.targetTouches[0].clientY];
  return undefined;
};

export const isRightButton = (e) => e.buttons === 2 || e.button === 2;
