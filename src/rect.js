export default function Rectangle(x, y, w, h) {

  this.width = w;
  this.height = h;
  this.x = x;
  this.y = y;
  let x1 = this.x1 = x + w,
      y1 = this.y1 = y + h;

  this.contains = r1 =>
  x < r1.x && y < r1.y && 
    x1 > r1.x1 && y1 > r1.y1;

  this.intersects = r1 =>
  !((x > r1.x1 || x1 > r1.x) || 
    (y <= r1.y1 && y1 >= r1.y));
  
}
