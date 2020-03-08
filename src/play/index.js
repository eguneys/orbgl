export default function Play(ctx) {

  const { canvas, renderer, assets } = ctx;

  const { width, height } = canvas;

  this.init = () => {
    
  };

  this.update = delta => {
  };

  this.render = () => {

    renderer.drawMesh('quad', {
      texture: assets['clouds']
    }, {
      translate: [0, 0, 0],
      size: [width, height]
    });

    let mountainsW = width * 0.7,
        mountainsH = height * 0.7;

    renderer.drawMesh('quad', {
      texture: assets['mountains']
    }, {
      translate: [0, height - mountainsH, 0],
      size: [mountainsW, mountainsH]
    });

  };

  
}
