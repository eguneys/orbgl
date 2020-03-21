import Loop from 'loopz';

import Assets from './fixi/assets';
import Canvas from './fixi/canvas';

import Play from './play';

import initRenderer from './renderer';
import atlasFrames from './atlas';

import Stats from 'stats.js';

export function app(element, options) {

  let assetsUrl = 'assets/images/';


  new Assets({
    'tiles': 'tile.png',
    'border': 'border.png'
  }, {
    assetsUrl
  }).start()
    .then(assets => {

      atlasFrames(assets);

      const canvas = new Canvas(element);

      const renderer = initRenderer(canvas);

      const ctx = {
        assets,
        renderer,
        canvas
      };

      const play = new Play(ctx);

      play.init({});

      let stats = new Stats();
      element.appendChild(stats.dom);

      new Loop(delta => {
        play.update(delta);
        play.render();
        stats.begin();
        renderer.render();
        stats.end();
      }).start();
      

    });


}
