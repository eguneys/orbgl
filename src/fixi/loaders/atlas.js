export default function extractFramesForAnimation(data, match, length) {

  let res = [];

  for (let i = 0; i < length; i++) {
    let name = match.replace('%', i);
    let { frame } = data.frames[name];

    res.push([frame.x, frame.y, frame.w, frame.h]);
  }

  return res;  
}
