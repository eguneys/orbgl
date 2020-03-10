import Animation from '../fixi/animation';

export default function Debug(ctx) {

  const { canvas, renderer, assets } = ctx;

  const { width, height } = canvas;

  let tileMountainsX;

  let magicFrames,
      smokeFrames;

  this.init = () => {
    
    tileMountainsX = 0;

    magicFrames = new Animation(assets['magicFrames']);
    smokeFrames = new Animation(assets['smokeFrames']);

  };

  this.update = delta => {

    tileMountainsX += 0.5;
    magicFrames.update(delta);
    smokeFrames.update(delta);
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
        frame: [tileMountainsX + 0.5, 0.5, 400, 200]
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

    renderer.drawMesh('quad', {
      texture: {
        src: assets['smoke'],
        frame: smokeFrames.frame()
      }
    }, {
      translate: [64, 0],
      size: [32, 32]
    });
  };
}
