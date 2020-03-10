import * as v from '../fixi/vec2';

const { vec2 } = v;

import * as mu from 'mutilz';

export default function Blob(play, ctx) {
  const { canvas, renderer, assets } = ctx;

  const { width, height } = canvas;

  let bs = {
    bHeight: 32,
    bWidth: 32,
    width,
    height
  };

  let tick;

  let pos;

  this.init = () => {
    
    tick = 0;

    pos = vec2(bs.width * 0.1, (bs.height - bs.bHeight) * 0.5);

  };

  this.update = delta => {
    tick += delta * 0.01;
  };

  this.render = () => {

    let off = pos;

    renderer.drawMesh('quad', {
      texture: {
        src: assets['blob']
      }
    }, {
      translate: off,
      size: [bs.bWidth, bs.bHeight]
    });

  };

  
}
