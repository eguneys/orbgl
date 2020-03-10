export function extractFramesForAnimation(data, match, length) {

  let res = [];

  for (let i = 0; i < length; i++) {
    let name = match.replace('%', i);
    let { frame } = data.frames[name];

    res.push([frame.x, frame.y, frame.w, frame.h]);
  }

  return res;  
}

export function makeHorizontalFrames(data, names, tileW, tileH) {

  let res = {};

  names.forEach((name, i) => {
    res[name] = [i * tileW, 0, tileW, tileH];
  });

  return res;  
}
