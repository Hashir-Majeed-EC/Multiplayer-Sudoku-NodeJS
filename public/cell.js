function Cell(x, y, w, val, revealed){
  this.x = x;
  this.y = y;
  this.w = w;
  this.revealed = revealed;
  this.val = round(val);
}

Cell.prototype.show = function(){
  if (this.revealed){
    //noFill();
    stroke('black');
    rect(this.x, this.y, this.w, this.w);
    textSize(15);
    stroke('red');
    text(this.val, this.x + this.w/2, this.y + this.w/2);
    //text(-1, this.x + this.w/2, this.y + this.w/2);
  } else {
    //fill(51);
    
    textSize(18);
    stroke(51);
    rect(this.x, this.y, this.w, this.w);
    //stroke('blue');
    text(this.val, this.x + this.w/2, this.y + this.w/2);
  }
  
}

Cell.prototype.contains = function(x, y){
  return (x > this.x && x < this.x + this.w && y > this.y && y < this.y + this.w);
}


