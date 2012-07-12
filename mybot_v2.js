// v2, getting better


var target;
var start;


function make_move(){
  var board = get_board(),
      my_x = get_my_x(),
      my_y = get_my_y(),
      width = WIDTH,
      height = HEIGHT,
      se_quad = get_quadrant(my_x,width,my_y,height),
      sw_quad = get_quadrant(0,my_x+1,my_y,height),
      nw_quad = get_quadrant(0,my_x+1,0,my_y+1),
      ne_quad = get_quadrant(my_x,width,0,my_y+1),
      quads = [sw_quad,se_quad,nw_quad,ne_quad];
  if (typeof start === 'undefined'){
    target = eat_unique();
    start = true;
  }
  if (board[my_x][my_y] > 0){
    if (typeof target !== 'undefined' && target[0] === my_x && target[1] === my_y) target = undefined;
    return TAKE;
  }
  if (typeof target !== 'undefined' && board[target[0]][target[1]] === 0) target = undefined;
  if (typeof target !== 'undefined') {
    return eat_closest() || go_towards_target(target);
  }else{
    target = get_closest_in_quad(quad_with_most_types(quads));
    return eat_closest() || go_towards_target(target);
  };
}


function get_quadrant(a,b,c,d){
  var quad = [];
  for (i=a;i<b;i++){
    for (j=c;j<d;j++){
      quad.push([i,j]);
    }
  }
  return quad;
}


function count_types(quad){
  var board = get_board(),
      res = [];
  for (i=1;i<get_number_of_item_types()+1;i++){
    res.push(0);
  }
  for (j=0;j<quad.length;j++){
    var r = board[quad[j][0]][quad[j][1]];
    if (r !== 0) res[r-1] = 1;
  }
  return res.count(1);
}


function quad_with_most_types(quads){
  var res = [];
  for (k=0;k<4;k++){
    res.push([count_types(quads[k]), quads[k]]);
  }
  res.assoc_sort_desc(0);
  return res[0][1];
}


function get_closest_in_quad(quad){
  var board = get_board(),
      my_x = get_my_x(),
      my_y = get_my_y();
      res = [];
  for (i=0;i<quad.length;i++){
    var r = board[quad[i][0]][quad[i][1]];
    if (r !== 0) {
      res.push([Math.abs(my_x-quad[i][0])+Math.abs(my_y-quad[i][1]),quad[i]]);
    }
  }
  res.assoc_sort_asc(0);
  return best_among_closest(res.filter_closest(res[0][0]));
}



function best_to_eat(){
  res = [];
  for (i=1;i<6;i++){
    res.push([i,Math.abs(get_my_item_count(i)-get_opponent_item_count(i))]);
  }
  res.assoc_sort_asc(1);
  return res[0][0];
}


function best_among_closest(closest){
  var board = get_board(),
      best = best_to_eat(),
      res = [];
  for (i=0;i<closest.length;i++){
    var x = closest[i][0], y = closest[i][1];
    if (board[x][y] === best) res.push(closest[i]);
  }
  if (res.length > 0) return res[0];
  return closest[0];
}



function go_towards_target(target){
  var board = get_board(),
      my_x = get_my_x(),
      my_y = get_my_y();
  if (target[1] === my_y && my_x < target[0]) return EAST;
  if (target[1] === my_y && my_x > target[0]) return WEST;
  if (target[0] === my_x && my_y < target[1]) return SOUTH;
  if (target[0] === my_x && my_y > target[1]) return NORTH;
  if (target[1] > my_y) {return SOUTH} else {return NORTH};
  if (target[0] > my_x) {return WEST} else {return EAST};
}


function eat_unique(){
  var board = get_board(),
      res;
  for (i=1;i<6;i++){
    if (get_total_item_count(i) === 1) res = i;
  }
  if (typeof res !== 'undefined'){
    for (j=0;j<WIDTH;j++){
      for (k=0;k<HEIGHT;k++){
        if (board[j][k] === res) var res2 = [j,k];
      }
    }
    return res2;
  }
}

function eat_closest(){
  var board = get_board();
  if (has_item(board[get_my_x()][get_my_y()+1])) return SOUTH;
  if (board[get_my_x()+1] && has_item(board[get_my_x()+1][get_my_y()])) return EAST;
  if (has_item(board[get_my_x()][get_my_y()-1])) return NORTH;
  if (board[get_my_x()-1] && has_item(board[get_my_x()-1][get_my_y()])) return WEST;
}


function default_board_number(){
  //return 221909;
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
