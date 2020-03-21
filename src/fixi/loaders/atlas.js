export function extractNineSlice(x, y, size) {
  const scaleFactor = [
    [[0, 0], [1, 0], [0, 0]],
    [[0, 1], [1, 1], [0, 1]],
    [[0, 0], [1, 0], [0, 0]]
  ];

  let res = [];
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      res.push({
        i,
        j,
        scale: scaleFactor[i][j],
        frame: [x + i * size,
         y + j * size, 
         size, size]
      });
    }
  }
  return res;
}

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
