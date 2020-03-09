const now = () => Date.now();

export default function Animation(frames, duration = 500, loop = true) {

  let frame = frames[0];
  let lastTime = now();


  this.update = delta => {

    let elapsed = (now() - lastTime) / duration;

    if (elapsed >= 1) {
      if (loop) {
        lastTime = now();
      }
      elapsed = 0.9;
    }

    frame = frames[Math.floor(elapsed * frames.length)];
  };

  this.frame = () => frame;
}
