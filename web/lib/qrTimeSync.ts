// Minimal QR encoder for the QR Time Sync tool: version 1, ECC level H,
// numeric mode, mask 0. Encodes a digit string (1-17 digits, i.e. a Unix
// epoch-milliseconds payload) into a 21x21 matrix of 0/1 modules.
//
// ECC level H (30% redundancy) is deliberate: frames filmed off a phone
// screen suffer motion blur and rolling-shutter tearing, and H keeps those
// decodable. Verified module-for-module against the python-qrcode reference
// implementation and OpenCV's decoder.

export const QR_SIZE = 21;
const DATA_CW = 9;
const ECC_CW = 17;

// GF(256) tables for Reed-Solomon
const GF_EXP = new Uint8Array(512);
const GF_LOG = new Uint8Array(256);
{
  let x = 1;
  for (let i = 0; i < 255; i++) {
    GF_EXP[i] = x;
    GF_LOG[x] = i;
    x <<= 1;
    if (x & 0x100) x ^= 0x11d;
  }
  for (let i = 255; i < 512; i++) GF_EXP[i] = GF_EXP[i - 255];
}

function gfMul(a: number, b: number): number {
  return a === 0 || b === 0 ? 0 : GF_EXP[GF_LOG[a] + GF_LOG[b]];
}

function rsGenerator(n: number): number[] {
  let g = [1];
  for (let i = 0; i < n; i++) {
    const next = new Array(g.length + 1).fill(0);
    for (let j = 0; j < g.length; j++) {
      next[j] ^= gfMul(g[j], GF_EXP[i]);
      next[j + 1] ^= g[j];
    }
    g = next;
  }
  return g.reverse();
}

const RS_GEN = rsGenerator(ECC_CW);

function rsEncode(data: number[]): number[] {
  const res = data.concat(new Array(ECC_CW).fill(0));
  for (let i = 0; i < data.length; i++) {
    const coef = res[i];
    if (coef !== 0) {
      for (let j = 1; j < RS_GEN.length; j++) res[i + j] ^= gfMul(RS_GEN[j], coef);
    }
  }
  return res.slice(data.length);
}

function encodeData(digits: string): number[] {
  if (!/^[0-9]{1,17}$/.test(digits)) throw new Error("payload must be 1-17 digits");
  const bits: number[] = [];
  const push = (val: number, len: number) => {
    for (let i = len - 1; i >= 0; i--) bits.push((val >> i) & 1);
  };
  push(0b0001, 4); // numeric mode
  push(digits.length, 10); // char count (10 bits for versions 1-9)
  for (let i = 0; i + 3 <= digits.length; i += 3) push(parseInt(digits.substr(i, 3), 10), 10);
  const rem = digits.length % 3;
  if (rem === 1) push(parseInt(digits.substr(digits.length - 1), 10), 4);
  else if (rem === 2) push(parseInt(digits.substr(digits.length - 2), 10), 7);
  push(0, Math.min(4, DATA_CW * 8 - bits.length)); // terminator
  while (bits.length % 8 !== 0) bits.push(0);
  const cw: number[] = [];
  for (let i = 0; i < bits.length; i += 8) {
    let b = 0;
    for (let j = 0; j < 8; j++) b = (b << 1) | bits[i + j];
    cw.push(b);
  }
  const pads = [0xec, 0x11];
  let p = 0;
  while (cw.length < DATA_CW) cw.push(pads[p++ % 2]);
  return cw;
}

// The function patterns, format info, and zigzag traversal order never change
// for a fixed version/ECC/mask, so build them once.
const baseM: number[][] = [];
const funM: boolean[][] = [];
const dataCoords: [number, number][] = [];
{
  for (let r = 0; r < QR_SIZE; r++) {
    baseM.push(new Array(QR_SIZE).fill(0));
    funM.push(new Array(QR_SIZE).fill(false));
  }
  const set = (r: number, c: number, v: boolean) => {
    baseM[r][c] = v ? 1 : 0;
    funM[r][c] = true;
  };
  const finder = (r0: number, c0: number) => {
    for (let r = -1; r <= 7; r++) {
      for (let c = -1; c <= 7; c++) {
        const rr = r0 + r;
        const cc = c0 + c;
        if (rr < 0 || rr >= QR_SIZE || cc < 0 || cc >= QR_SIZE) continue;
        const inside = r >= 0 && r <= 6 && c >= 0 && c <= 6;
        const dark =
          inside &&
          (r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4));
        set(rr, cc, dark);
      }
    }
  };
  finder(0, 0);
  finder(0, QR_SIZE - 7);
  finder(QR_SIZE - 7, 0);
  for (let i = 8; i < QR_SIZE - 8; i++) {
    set(6, i, i % 2 === 0);
    set(i, 6, i % 2 === 0);
  }
  set(QR_SIZE - 8, 8, true); // dark module
  for (let i = 0; i < 9; i++) {
    if (!funM[8][i]) set(8, i, false);
    if (!funM[i][8]) set(i, 8, false);
  }
  for (let i = 0; i < 8; i++) {
    if (!funM[8][QR_SIZE - 1 - i]) set(8, QR_SIZE - 1 - i, false);
    if (!funM[QR_SIZE - 1 - i][8]) set(QR_SIZE - 1 - i, 8, false);
  }

  // format info for ECC H, mask 0 (BCH 15,5 + spec XOR mask)
  const fmt5 = (0b10 << 3) | 0;
  let rem = fmt5 << 10;
  for (let i = 14; i >= 10; i--) if ((rem >> i) & 1) rem ^= 0b10100110111 << (i - 10);
  const fmt = ((fmt5 << 10) | rem) ^ 0b101010000010010;
  const A: [number, number][] = [
    [8, 0], [8, 1], [8, 2], [8, 3], [8, 4], [8, 5], [8, 7], [8, 8],
    [7, 8], [5, 8], [4, 8], [3, 8], [2, 8], [1, 8], [0, 8],
  ];
  const B: [number, number][] = [
    [20, 8], [19, 8], [18, 8], [17, 8], [16, 8], [15, 8], [14, 8],
    [8, 13], [8, 14], [8, 15], [8, 16], [8, 17], [8, 18], [8, 19], [8, 20],
  ];
  for (let i = 0; i < 15; i++) {
    const b = (fmt >> (14 - i)) & 1;
    baseM[A[i][0]][A[i][1]] = b;
    baseM[B[i][0]][B[i][1]] = b;
  }

  // zigzag order of the data modules
  let upward = true;
  for (let col = QR_SIZE - 1; col > 0; col -= 2) {
    if (col === 6) col--;
    for (let i = 0; i < QR_SIZE; i++) {
      const row = upward ? QR_SIZE - 1 - i : i;
      for (const c of [col, col - 1]) {
        if (!funM[row][c]) dataCoords.push([row, c]);
      }
    }
    upward = !upward;
  }
}

export function buildMatrix(digits: string): number[][] {
  const data = encodeData(digits);
  const codewords = data.concat(rsEncode(data));
  const m = baseM.map((r) => r.slice());
  let bi = 0;
  for (const cw of codewords) {
    for (let k = 7; k >= 0; k--) {
      const [r, c] = dataCoords[bi++];
      let bit = (cw >> k) & 1;
      if ((r + c) % 2 === 0) bit ^= 1; // mask 0
      m[r][c] = bit;
    }
  }
  return m;
}
