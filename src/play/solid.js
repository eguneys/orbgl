import genTiles from '../gen';

export default function Solid(play, ctx) {

  const { canvas, renderer, assets } = ctx;

  const { width, height } = canvas;  

  let tS = 8;

  let tiles;

  this.init = () => {
    tiles = genTiles(width * 0.2, height * 0.2);
  };

  this.update = delta => {
  };

  this.render = () => {
    solid(0, 0);

    tiles.traverse((data, rect) => {
      for (let i = 0; i < rect.width; i+=tS) {
        for (let j = 0; j < rect.height; j+=tS) {
          solid(rect.x + i, rect.y + j);
        }
      }
    });

  };

  const solid = (x, y) => {
    renderer.drawMesh('quad', {
      texture: {
        src: assets['grassatlas'],
        frame: [0, 0, 1, 1]
      }
    }, {
      translate: [x, y],
      size: [tS, tS]
    });      
  };
}
