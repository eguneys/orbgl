import Benchmark from './benchmark';
import Solid from './solid';

export default function Play(ctx) {

  const { canvas, renderer, assets } = ctx;

  const { width, height } = canvas;

  let benchmark = new Benchmark(this, ctx);
  let solid = new Solid(this, ctx);

  this.init = (data) => {
    benchmark.init({});
    solid.init({});
  };


  this.update = delta => {
    benchmark.update(delta);
    solid.update(delta);
  };

  this.render = () => {

    benchmark.render();
    // solid.render();    

  };
}
