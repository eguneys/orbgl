export default function Ground(play, ctx) {

  const { canvas, renderer, assets } = ctx;

  const { width, height } = canvas;

  const bs = {
    gWidth: 32,
    gHeight: 32
  };

  this.init = () => {
    
  };

  this.update = delta => {
  };

  this.render = () => {
    let gw = bs.gWidth;
    drawLeftCorner([0, 0]);
    drawTop([gw, 0]);
    drawRightCorner([gw * 2, 0]);
    drawLeftSide([0, gw]);
    drawMiddle([gw, gw]);
    drawRightSide([gw * 2, gw]);
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
