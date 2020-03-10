import QuadTree from './quadtree';

export default function Destructible(x, y, w, h, state) {

  let body = new QuadTree(x, y, w, h, state, 10);

  this.traverse = body.traverse;

  this.modifyByRectangle = (r, newState, isRelative = false) => {
    body.updateWithRectangle(r, newState);
  };

}
