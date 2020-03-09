import Animation from '../fixi/animation';

export default function Play(ctx) {

  const { canvas, renderer, assets } = ctx;

  const { width, height } = canvas;

  let tileMountainsX;

  let magicFrames;

  this.init = () => {
    
    tileMountainsX = 0;

    magicFrames = new Animation([
      [64 * 0, 0, 64, 64],
      [64 * 1, 0, 64, 64],
      [64 * 2, 0, 64, 64],
      [64 * 3, 0, 64, 64],
      [64 * 4, 0, 64, 64],
    ]);

  };

  this.update = delta => {

    tileMountainsX += 1;
    magicFrames.update(delta);
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

    let mountainsW = width,
        mountainsH = height * 0.7;

    renderer.drawMesh('quad', {
      texture: {
        src: assets['mountains'],
        frame: [tileMountainsX + 0.5, 0.5, 600, 200]
      }
    }, {
      translate: [0, height - mountainsH],
      size: [mountainsW, mountainsH],
    });

    renderer.drawMesh('quad', {
      texture: {
        src: assets['magic'],
        frame: magicFrames.frame()
      }
    }, {
      translate: [0, 0],
      size: [64, 64]
    });
  };
}
