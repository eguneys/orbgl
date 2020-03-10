import Destructible from './dquad/destructible';

export default function genTiles(w, h) {

  let tiles = new Tiles(w, h);

  return tiles;
}

function Tiles(w, h) {
  
  const visibleState = {
    hidden: false
  };
  const hiddenState = {
    hidden: true
  };

  let body = new Destructible(0, 0, w, h, visibleState);

  this.traverse = body.traverse;

}
