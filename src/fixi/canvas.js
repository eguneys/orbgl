export default function canvas(element) {
  
  const canvas = document.createElement('canvas'),
        gl = canvas.getContext('webgl2');

  element.append(canvas);

  const displayWidth = element.clientWidth,
        displayHeight = element.clientHeight;

  canvas.width = this.width = displayWidth;
  canvas.height = this.height = displayHeight;

  this.aspect = this.width / this.height;

  this.canvas = canvas;
  this.gl = gl;

}
