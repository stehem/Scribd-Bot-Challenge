// v2, getting better


function make_move(){
  var turn = new Turn();
  return turn.direction;
}


function default_board_number(){
  //return 926669;
}


var mybot = {
  target: undefined,
  start: undefined,
  quad: undefined
}


var Turn = function(){
  this.board = get_board(),
  this.my_x = get_my_x(),
  this.my_y = get_my_y(),
  this.se_quad = this.get_quadrant(this.my_x,WIDTH,this.my_y,HEIGHT),
  this.sw_quad = this.get_quadrant(0,this.my_x+1,this.my_y,HEIGHT),
  this.nw_quad = this.get_quadrant(0,this.my_x+1,0,this.my_y+1),
  this.ne_quad = this.get_quadrant(this.my_x,WIDTH,0,this.my_y+1),
  this.quads = [this.sw_quad,this.se_quad,this.nw_quad,this.ne_quad],
  this.direction = this.init();
}


Turn.prototype.init = function(){
  if (mybot.start === undefined){
    mybot.target = this.eat_unique();
    mybot.start = true;
  }
  if (this.board[this.my_x][this.my_y] > 0){
    if (mybot.target !== undefined && mybot.target[0] === this.my_x && mybot.target[1] === this.my_y) mybot.target = undefined;
    return TAKE;
  }
  if (mybot.target !== undefined && this.board[mybot.target[0]][mybot.target[1]] === 0) mybot.target = undefined;
  if (mybot.quad === undefined || (mybot.quad !== undefined && !this.has_fruits(mybot.quad))){
    mybot.quad = this.quad_with_most_types(this.quads);
  }
  if (mybot.target !== undefined) {
    return this.go_towards_target(mybot.target);
  }else{
    mybot.target = this.get_closest_in_quad(mybot.quad);
    return this.go_towards_target(mybot.target);
  };
}


Turn.prototype.get_quadrant = function(a,b,c,d){
  var quad = [];
  for (i=a;i<b;i++){
    for (j=c;j<d;j++){
      quad.push([i,j]);
    }
  }
  return quad;
}


Turn.prototype.count_types = function(quad){
  var res = [];
  for (i=1;i<get_number_of_item_types()+1;i++){
    res.push(0);
  }
  for (j=0;j<quad.length;j++){
    var r = this.board[quad[j][0]][quad[j][1]];
    if (r !== 0) res[r-1] = 1;
  }
  return res.count(1);
}


Turn.prototype.count_fruits = function(quad){
  var res = 0;
  for (j=0;j<quad.length;j++){
    var r = this.board[quad[j][0]][quad[j][1]];
    if (r !== 0) res++;
  }
  return res;
}


Turn.prototype.quad_with_most_types = function(){
  var res = [];
  for (k=0;k<4;k++){
    res.push([this.count_types(this.quads[k]), this.quads[k]]);
  }
  res.assoc_sort_desc(0);
  return res[0][1];
}


Turn.prototype.quad_with_most_fruits = function(){
  var res = [];
  for (k=0;k<4;k++){
    res.push([this.count_fruits(this.quads[k]), this.quads[k]]);
  }
  res.assoc_sort_desc(0);
  return res[0][1];
}


Turn.prototype.get_closest_in_quad = function(quad){
  var res = [];
  for (i=0;i<quad.length;i++){
    var r = this.board[quad[i][0]][quad[i][1]];
    if (r !== 0) {
      res.push([Math.abs(this.my_x-quad[i][0])+Math.abs(this.my_y-quad[i][1]),quad[i]]);
    }
  }
  res.assoc_sort_asc(0);
  return this.best_among_closest(res.filter_closest(res[0][0]));
}


Turn.prototype.best_to_eat = function(){
  res = [];
  for (i=1;i<6;i++){
    res.push([i,Math.abs(get_my_item_count(i)-get_opponent_item_count(i))]);
  }
  res.assoc_sort_asc(1);
  return res[0][0];
}


Turn.prototype.best_among_closest = function(closest){
  var best = this.best_to_eat(),
      res = [];
  for (i=0;i<closest.length;i++){
    var x = closest[i][0], y = closest[i][1];
    if (this.board[x][y] === best) res.push(closest[i]);
  }
  if (res.length > 0) return res[0];
  return closest[0];
}


Turn.prototype.go_towards_target = function(target){
  if (target[1] === this.my_y && this.my_x < target[0]) return EAST;
  if (target[1] === this.my_y && this.my_x > target[0]) return WEST;
  if (target[0] === this.my_x && this.my_y < target[1]) return SOUTH;
  if (target[0] === this.my_x && this.my_y > target[1]) return NORTH;
  if (target[1] > this.my_y) {return SOUTH} else {return NORTH};
  if (target[0] > this.my_x) {return WEST} else {return EAST};
}


Turn.prototype.eat_unique = function(){
  var res;
  for (i=1;i<6;i++){
    if (get_total_item_count(i) === 1) res = i;
  }
  if (res !== 'undefined'){
    for (j=0;j<WIDTH;j++){
      for (k=0;k<HEIGHT;k++){
        if (this.board[j][k] === res) var res2 = [j,k];
      }
    }
    return res2;
  }
}


Turn.prototype.eat_closest = function(){
  if (has_item(this.board[get_my_x()][get_my_y()+1])) return SOUTH;
  if (this.board[get_my_x()+1] && has_item(this.board[get_my_x()+1][get_my_y()])) return EAST;
  if (has_item(this.board[get_my_x()][get_my_y()-1])) return NORTH;
  if (this.board[get_my_x()-1] && has_item(this.board[get_my_x()-1][get_my_y()])) return WEST;
}


Turn.prototype.has_fruits = function(quad){
  for (i=0;i<quad.length;i++){
    if (this.board[quad[i][0]][quad[i][1]] > 0) return true;
  }
  return false;
}
 

// homemade array utility functions
Array.prototype.remove_assoc_pair = function(arr){
  for (i=0;i<this.length;i++){
    if (this[i][0] === arr[0] && this[i][1] === arr[1]){
      this.splice(i,1);
      i--;
    }
  }
  return this;
}


Array.prototype.count = function(el){
  var res = 0;
  for (i=0;i<this.length;i++){
    if (this[i] === el) res++
  }
  return res;
}


Array.prototype.filter_closest = function(score){
  var res = [];
  for (i=0;i<this.length;i++){
    if (this[i][0] === score) res.push(this[i][1]) ;
  }
  return res;
}


Array.prototype.assoc_sort_asc = function(n){
  this.sort(function(a,b){
    if (a[n] < b[n]) return -1;
    if (a[n] > b[n]) return 1;
    return 0;
  });
}


Array.prototype.assoc_sort_desc = function(n){
  this.sort(function(a,b){
    if (a[n] > b[n]) return -1;
    if (a[n] < b[n]) return 1;
    return 0;
  });
}
