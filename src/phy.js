import * as v from './fixi/vec2';

const { vec2 } = v;

export default function Phy({
  pos = vec2(0),
  vel = vec2(0),
  acc = vec2(0),
  gravity = vec2(0, -10),
  friction = 1
}) {
  
  this.pos = v.makeAttribute(pos);
  this.vel = v.makeAttribute(vel);
  this.acc = v.makeAttribute(acc);
  this.gravity = v.makeAttribute(gravity);

  this.addVel = (a, b) => {
    v.add(vel, [a, b]);
  };


  this.calculation = (delta, collisions = {}) => {
    const dt = delta;

    let forces = vec2(0),
        newVel = vec2(0),
        newPos = vec2(0);

    v.add(forces, acc, gravity);

    v.add(newVel, vel);
    v.addScale(newVel, forces, dt);

    // collisions

    v.add(newPos, pos);
    v.addScale(newPos, newVel, dt);

    return {
      vel: newVel,
      pos: newPos
    };
  };

  const applyCalculation = ({ pos, vel }) => {
    this.vel(vel[0], vel[1]);
    this.pos(pos[0], pos[1]);
  };

  this.update = (delta) => {
    applyCalculation(this.calculation(delta));
  };

  this.updateWithCollisions = (delta, resolveCollision) => {
    let calculation = this.calculation(delta);
    calculation = resolveCollision(pos, vel, calculation.pos, calculation.vel);
    applyCalculation(calculation);
  };

}
