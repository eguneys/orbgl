import * as v from './vec2';

export function identity() {
  return [
    1, 0, 0,
    0, 1, 0,
    0, 0, 1
  ];
};

/*
 * 2 / width, 0, 0,
 * 0, -2/height, 0,
 * 0, 0, 1    
 */
export function projection(width, height) {
  return [
    2 / width, 0, 0,
    0, -2 / height, 0,
    -1, 1, 1
  ];
}

export function translation(tx, ty) {
  return [
    1, 0, 0,
    0, 1, 0,
    tx, ty, 1
  ];
}

export function scaling(sx, sy) {
  return [
    sx, 0, 0,
    0, sy, 0,
    0, 0, 1
  ];
}

export function rotation(angle) {
  var c = Math.cos(angle),
      s = Math.sin(angle);

  return [
    c, s, 0,
    -s, c, 0,
    0, 0, 1
  ];
}

export function multiply(a, b) {
  var a00 = a[0 * 3 + 0];
  var a01 = a[0 * 3 + 1];
  var a02 = a[0 * 3 + 2];
  var a10 = a[1 * 3 + 0];
  var a11 = a[1 * 3 + 1];
  var a12 = a[1 * 3 + 2];
  var a20 = a[2 * 3 + 0];
  var a21 = a[2 * 3 + 1];
  var a22 = a[2 * 3 + 2];
  var b00 = b[0 * 3 + 0];
  var b01 = b[0 * 3 + 1];
  var b02 = b[0 * 3 + 2];
  var b10 = b[1 * 3 + 0];
  var b11 = b[1 * 3 + 1];
  var b12 = b[1 * 3 + 2];
  var b20 = b[2 * 3 + 0];
  var b21 = b[2 * 3 + 1];
  var b22 = b[2 * 3 + 2];
  
  return [
    b00 * a00 + b01 * a10 + b02 * a20,
    b00 * a01 + b01 * a11 + b02 * a21,
    b00 * a02 + b01 * a12 + b02 * a22,
    b10 * a00 + b11 * a10 + b12 * a20,
    b10 * a01 + b11 * a11 + b12 * a21,
    b10 * a02 + b11 * a12 + b12 * a22,
    b20 * a00 + b21 * a10 + b22 * a20,
    b20 * a01 + b21 * a11 + b22 * a21,
    b20 * a02 + b21 * a12 + b22 * a22,
  ];
}

export function translate(m, tx, ty) {
  return multiply(m, translation(tx, ty));
}

export function scale(m, sx, sy) {
  return multiply(m, scaling(sx, sy));
}

export function rotate(m, angle) {
  return multiply(m, rotation(angle));
}

export function transform(m, ts) {

  function protectAnchor(size, f) {
    if (!size) {
      f();
      return;
    }

    let anchor = v.scale(size, 0.5);
    m = translate(m, anchor[0], anchor[1]);
    f();
    m = translate(m, -anchor[0], -anchor[1]);
  }


  if (ts.translate) {
    m = translate(m, ts.translate[0], ts.translate[1]);
  }


  if (ts.rotate) {
    protectAnchor(ts.size, () => {
      m = rotate(m, ts.rotate);
    });
  }

  if (ts.scale) {
    protectAnchor(ts.size, () => {
      m = scale(m, Math.sign(ts.scale[0]), Math.sign(ts.scale[1]));
    });
    m = scale(m, Math.abs(ts.scale[0]), Math.abs(ts.scale[1]));
  }
  
  return m;
}