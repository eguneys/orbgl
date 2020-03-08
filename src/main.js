import Loop from 'loopz';

import Assets from './fixi/assets';
import Canvas from './fixi/canvas';

import Play from './play';

import initRenderer from './renderer';

export function app(element, options) {


  new Assets({
    'uvgrid': 'assets/images/ash_uvgrid01.jpg'
  }).start()
    .then(assets => {

      const canvas = new Canvas(element);

      const renderer = initRenderer(canvas);

      const ctx = {
        assets,
        renderer,
        canvas
      };

      const play = new Play(ctx);

      new Loop(delta => {
        play.update(delta);
        play.render();
        renderer.render();
      }).start();
      

    });


}
