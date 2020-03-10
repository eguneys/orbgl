export default function Background(play, ctx) {

  const { canvas, renderer, assets } = ctx;

  const { width, height } = canvas;

  const bs = {
    height: height,
    mountainsW: width,
    mountainsH: height * 0.7
  };

  let tileMountainsX;

  this.init = () => {
    tileMountainsX = 0;
  };

  this.update = delta => {
    tileMountainsX += 0.5;
  };

  this.render = () => {

    renderer.drawMesh('quad', {
      texture: {
        src: assets['clouds']
      }
    }, {
      translate: [0, 0],
      size: [width, height]
    });

    renderer.drawMesh('quad', {
      texture: {
        src: assets['mountains'],
        frame: [tileMountainsX + 0.5, 0.5, 400, 200]
      }
    }, {
      translate: [0, bs.height - bs.mountainsH],
      size: [bs.mountainsW, bs.mountainsH],
    });

  };

  
}
