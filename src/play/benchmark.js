import Animation from '../fixi/animation';
import Pool from 'poolf';

import * as v from '../fixi/vec2';
import Phy from '../phy';

export default function Benchmark(play, ctx) {
  const { canvas, renderer, assets } = ctx;

  const { width, height } = canvas;


  let bunnies = new Pool(() => new Bunny(play, ctx));

  const allocateBatch = () => {
    for (let i = 0; i < 10; i++) {
      let vel = [i*10, 0];
      bunnies.acquire(_ => _.init({
        vel
      }));
    }
  };

  this.init = () => {
    allocateBatch();
  };

  this.update = delta => {
    bunnies.each(_ => _.update(delta));
  };

  this.render = () => {
    bunnies.each(_ => _.render());
  };
  
}

function Bunny(play, ctx) {
  const { canvas, renderer, assets } = ctx;

  const { width, height } = canvas;


  let tS = 32;

  let phy = new Phy({ gravity: [0, 30] });

  let magicFrames;

  this.init = ({ vel = [0, 0] }) => {
    
    magicFrames = new Animation(assets['magicFrames']);

    phy.pos(0, 0);
    phy.vel(vel[0], vel[1]);
  };

  this.update = delta => {
    magicFrames.update();
    phy.updateWithCollisions(delta * 0.01, resolveCollision);
  };

  const collideLeft = pos => pos[0] < 0,
        collideRight = pos => pos[0] > width,
        collideTop = pos => pos[1] < 0,
        collideBottom = pos => pos[1] > height;

  const resolveCollision = (oldPos, oldVel, dNewPos, dNewVel) => {

    let newVel = v.copy(dNewVel);
    let newPos = dNewPos;

    if (collideLeft(dNewPos) || collideRight(dNewPos)) {
      v.mul(newVel, [-1, 1]);
      newPos = oldPos;
    }

    if (collideTop(dNewPos) || collideBottom(dNewPos)) {
      v.mul(newVel, [1, -1]);
      newPos = oldPos;
    }

    return {
      pos: newPos,
      vel: newVel
    };
  };

  this.render = () => {

    renderer.drawMesh('quad', {
      texture: {
        src: assets['magic'],
        frame: magicFrames.frame()
      }
    }, {
      translate: phy.pos(),
      size: [tS, tS]
    });

  };
}
