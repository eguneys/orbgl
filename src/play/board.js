import { objMap } from '../fixi/util2';
import * as v from '../fixi/vec2';

import { allKeys, pos2key, key2pos } from '../strat/util';


export default function Board(play, ctx) {
  const { renderer, assets, canvas } = ctx;

  let boundsF = canvas.responsiveBounds(({ width, height}) => {

    const tileSize = Math.round(height / 8),
          boardSize = tileSize * 8;
    

    return {
      width,
      height,
      tileSize,
      boardSize
    };
  });

  const { state } = ctx;

  const tiles = {};

  this.init = data => {

    let bs = boundsF();

    allKeys.forEach(key => {
      let pos = key2pos(key);
      let tile = new Tile(this, ctx, bs);
      tile.init({ key, pos });
      tiles[key] = tile;
    });

  };

  this.update = delta => {
  };

  this.render = () => {
    let bs = boundsF();

    objMap(tiles, (_, tile) => tile.render());

  };

}

function Tile(play, ctx, bs) {

  const { renderer, assets } = ctx;

  const colorsByTheme = {
    standard: ['white', 'black'],
    colored: ['white2', 'black2']
  };

  const colors = colorsByTheme['standard'];

  const colorIndex = (pos) => {
    return (pos[0] + pos[1]) % 2;
  };

  let tS = bs.tileSize;

  let wPos, vPos;

  let color;

  this.init = (data) => {

    wPos = data.pos;
    vPos = v.copy(wPos);
    v.add(vPos, [-1, -1]);
    v.scale(vPos, tS);

    color = colors[colorIndex(wPos)];
  };

  this.update = delta => {
  };

  this.render = () => {

    renderer.drawMesh('quad', {
      texture: {
        src: assets['tiles'],
        frame: assets.tileFrames[color]
      }
    }, {
      translate: vPos,
      size: [tS, tS]
    });

  };

}
