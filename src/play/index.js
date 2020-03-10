import Background from './bg';
import Blob from './blob';
import Ground from './ground';

import genTiles from '../gen';

export default function Play(ctx) {

  const { canvas, renderer, assets } = ctx;

  const { width, height } = canvas;

  let bg = new Background(this, ctx);
  let blob = new Blob(this, ctx);
  let ground = new Ground(this, ctx);

  this.init = (data) => {
    data.tiles = genTiles();

    bg.init({});
    blob.init({});
    ground.init({
      tiles: data.tiles
    });
  };


  this.update = delta => {
    bg.update(delta);
    blob.update(delta);
    ground.update(delta);
  };

  this.render = () => {
    bg.render();
    blob.render();
    ground.render();
  };
}
