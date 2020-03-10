import Destructible from './destructible';

export default function genTiles(w, h) {

  let tiles = new Destructible(0, 0, w, h, null);

  return tiles;
}
