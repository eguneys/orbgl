import Board from './board';

export default function Play(ctx) {

  const { canvas, renderer, assets } = ctx;

  const { width, height } = canvas;

  let board = new Board(this, ctx);

  this.init = (data) => {

    board.init(data);

  };


  this.update = delta => {
    board.update(delta);
  };

  this.render = () => {
    board.render();
  };
}
