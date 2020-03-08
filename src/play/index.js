export default function Play(ctx) {

  const { canvas, renderer, assets } = ctx;

  const { width, height } = canvas;

  this.init = () => {
    
  };

  this.update = delta => {
  };

  this.render = () => {

    renderer.drawMesh('quad', {
      texture: assets['uvgrid']
    }, {
      translate: [10, 10, 0],
      size: [400, 400]
    });

  };

  
}
