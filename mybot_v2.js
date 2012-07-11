// v2, less dumb, still not the brightest tool in the shed...


var target;


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
  if (board[my_x][my_y] > 0){
    if (typeof target !== 'undefined' && target[0] === my_x && target[1] === my_y) target = undefined;
    return TAKE;
  }
  if (typeof target !== 'undefined' && board[target[0]][target[1]] === 0) target = undefined;
  if (typeof target !== 'undefined') {
    return go_towards_target(target);
  }else{
    target = get_best_in_quad(quad_with_most_types(quads)) || get_closest_in_quad(quad_with_most_types(quads));
    return go_towards_target(target);
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
  res.sort(function(a,b){
    if (a[0] > b[0]) return -1;
    if (a[0] < b[0]) return 1;
    return 0;
  });
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
  res.sort(function(a,b){
    if (a[0] < b[0]) return -1;
    if (a[0] > b[0]) return 1;
    return 0;
  });
  return res[0][1];
}

function best_to_eat(){
res = [];
for (i=1;i<6;i++){
res.push([i,Math.abs(get_my_item_count(i)-get_opponent_item_count(i))]);
}
  res.sort(function(a,b){
    if (a[1] < b[1]) return -1;
    if (a[1] > b[1]) return 1;
    return 0;
  });
return res[0][0];
}

function get_best_in_quad(quad){
  res =[];
  for (i=0;i++;i<quad.length){
    var r = board[quad[i][0]][quad[i][1]];
    if (r === best_to_eat()) res.push(quad[i]);
  }
  if (res.length > 0) return res[0];
  return false;
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


function fruits_types_in_quad(quad){
  var ftypes = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0}
  for (i=0;i<quad.length;i++){
    var r = board[quad[i][0]][quad[i][1]];
    if (r !== 0) ftypes[r] = ftypes[r] + 1
  }
  return ftypes;
}


function fruit_types_of_opponent(){
  var otypes = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0};
  for (i=0;i<6;i++){
    otypes[i] = get_opponent_item_count(i);
  }
  return otypes;
}



function default_board_number(){
  return 439037;
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



