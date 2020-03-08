export default function PlaneGeometry(width = 1, height = width, widthSegments = 1, heightSegments = 1) {
  

  let vertices = [],
      uvs = [],
      indices = [];


  let widthHalf = width / 2,
      heightHalf = height / 2;

  let gridX = Math.floor(widthSegments),
      gridY = Math.floor(heightSegments),
      gridX1 = gridX + 1,
      gridY1 = gridY + 1;


  let segmentWidth = width / gridX,
      segmentHeight = height / gridY;

  for (let iy = 0; iy < gridY1; iy++) {
    let y = iy * segmentHeight;

    for (let ix = 0; ix < gridX1; ix++) {
      let x = ix * segmentWidth;

      vertices.push(x, y, 0);
      uvs.push(ix / gridX, 1 - (iy / gridY));
    }
  }

  for (let iy = 0; iy < gridY; iy++) {
    for (let ix = 0; ix < gridX; ix++) {
      let a = ix + gridX1 * iy,
          b = ix + gridX1 * (iy + 1),
          c = (ix + 1) + gridX1 * (iy + 1),
          d = (ix + 1) + gridX1 * iy;

      indices.push(a, b, d);
      indices.push(b, c, d);
    }
  }

  return { vertices,
           uvs,
           indices };
}
