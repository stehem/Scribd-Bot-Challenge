//http://www.scribd.com/jobs/botrace_api
//
//very very much a work in progress !!!



function make_move() {
  var board = get_board(),
      my_x = get_my_x(),
      my_y = get_my_y(),
      width = WIDTH,
      height = HEIGHT;

  // we found an item! take it!
  if (board[my_x][my_y] > 0) {
    return TAKE;
  }

  //get all quadrants
  var sw_quad = get_quadrant(0,my_x+1,my_y,height+1),
      se_quad = get_quadrant(my_x,width,my_y,height+1),
      nw_quad = get_quadrant(0,my_x+1,0,my_y+1),
      ne_quad = get_quadrant(my_x,width,0,my_y+1),
      quads = [sw_quad,se_quad,nw_quad,ne_quad];

  var fruits_in_sw = fruits_in_quad(sw_quad,0,my_y),
      fruits_in_se = fruits_in_quad(se_quad,my_x,my_y),
      fruits_in_nw = fruits_in_quad(nw_quad,0,0),
      fruits_in_ne = fruits_in_quad(ne_quad,my_x,0);


  var target = get_closest_in_quad(fruits_in_quad(quad_with_most_types(quads),x,y));
  

  if (target[1] === my_y && my_x < target[0]) return EAST;
  if (target[1] === my_y && my_x > target[0]) return WEST;
  if (target[0] === my_x && my_x < target[1]) return SOUTH;
  if (target[0] === my_x && my_x > target[1]) return NORTH;
  if (target[1] > my_y) {return SOUTH} else {return NORTH};
  if (target[0] > my_x) {return WEST} else {return EAST};




}

function get_quadrant(n,limit,start,end){
  var quad = [];
  for (i=n;i<limit;i++){
    quad.push(board[i].slice(start,end));
  } 
  return quad;
}


function count_types(quad){
  var res = [];
  for (i=1;i<get_number_of_item_types()+1;i++){
    res.push(0);
  }

  for (i=0;i<quad.length;i++){
    for (j=0;j<quad[i].length;j++){
      if (quad[i][j] !== 0) res[quad[i][j]-1] = 1;
    }
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


function fruits_in_quad(quad,x,y){
  var res = [];
  for (i=0;i<quad.length;i++){
    for (j=0;j<quad[i].length;j++){
      if (quad[i][j] !== 0) res.push([i+x,j+y]);
    }
  }
  return res;
}


function get_closest_in_quad(fruits){
  for (i=0;i<fruits.length;i++){
    fruits[i].push(Math.abs(my_x - fruits[i][0]) + Math.abs(my_y - fruits[i][1]));
  }

  fruits.sort(function(a,b){
    if (a[2] < b[2]) return -1;
    if (a[2] > b[2]) return 1;
    return 0;
  });

  return fruits[0].slice(0,2);
}








function default_board_number() {
    return 123;
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
