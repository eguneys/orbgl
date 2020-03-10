
export default function Ground(play, ctx) {

  const { canvas, renderer, assets } = ctx;

  const { width, height } = canvas;

  const bs = {
    gWidth: 32,
    gHeight: 32
  };

  let tiles;

  const hideState = {
    hidden: true
  };
  const visibleState = {
    hidden: false
  };

  this.init = (data) => {
    tiles = data.tiles;
  };

  this.update = delta => {
  };

  this.render = () => {

  };



  const makeGrassDraw = (side, flip) => (translate) =>
        renderer.drawMesh('quad', {
          texture: {
            src: assets['grassatlas'],
            frame: assets['grassFrames'][side]
          }
        }, {
          translate,
          scale: [flip?-1:1, 1],
          size: [bs.gWidth, bs.gHeight]
        });

  const drawLeftCorner = makeGrassDraw('leftCorner'),
        drawRightCorner = makeGrassDraw('leftCorner', true),
        drawLeftSide = makeGrassDraw('left'),
        drawRightSide = makeGrassDraw('left', true),
        drawTop = makeGrassDraw('top'),
        drawMiddle = makeGrassDraw('middle');
}
