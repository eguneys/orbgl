import Solid from './solid';

export default function Play(ctx) {

  const { canvas, renderer, assets } = ctx;

  const { width, height } = canvas;

  let solid = new Solid(this, ctx);

  this.init = (data) => {
    solid.init({});
  };


  this.update = delta => {
    solid.update(delta);
  };

  this.render = () => {

    solid.render();    

  };
}
