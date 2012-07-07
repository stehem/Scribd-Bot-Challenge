//http://www.scribd.com/jobs/botrace_api
//
//very very much a work in progress !!!

var quadrant;

function new_game() {
}

function make_move() {
  var board = get_board();

  // we found an item! take it!
  if (board[get_my_x()][get_my_y()] > 0) {
    return TAKE;
  }

  find_closest(board);



  return eat_closest(board) || find_closest(board) || EAST;

  return PASS;
}


function eat_closest(board){
  if (has_item(board[get_my_x()][get_my_y()+1])){
    return SOUTH;
  } 
  else if (board[get_my_x()+1] && has_item(board[get_my_x()+1][get_my_y()])){
    return EAST;
  }
  else if (has_item(board[get_my_x()][get_my_y()-1])){
    return NORTH;
  }
  else if (board[get_my_x()-1] && has_item(board[get_my_x()-1][get_my_y()])){
    return WEST;
  }

  else{
    return false;
  }
}


function find_closest(board, nb){
  var my_x = get_my_x(),
    my_y = get_my_y(),
    res = [],
    res2 = [];


  var n = 1;

  while (res2.length == 0 && n < board.length){
    for (j=my_x-n;j<my_x+n+1;j++){
      for (i=my_y-n;i<my_y+n+1;i++){
        res.push([j,i]);
      }
    }
    for (i=0;i<res.length;i++){
      if (board[res[i][0]] && has_item(board[res[i][0]][res[i][1]])) 
      {res2.push(res[i]);}
    }
    res2.remove_assoc_pair([my_x, my_y]);
    n++;
  }



  function get_closest(res2){
    for (i=0;i<res2.length;i++){
      res2[i].push(Math.abs(my_x - res2[i][0]) + Math.abs(my_y - res2[i][1]));
    }

    res2.sort(function(a,b){
      if (a[2] < b[2]) return -1;
      if (a[2] > b[2]) return 1;
      return 0;
    }); 

    return res2[0].slice(0,2);
  }

  var target = get_closest(res2);
  


  if (target[1] === my_y && my_x < target[0]) return EAST;
  if (target[1] === my_y && my_x > target[0]) return WEST;
  if (target[0] === my_x && my_x < target[1]) return SOUTH;
  if (target[0] === my_x && my_x > target[1]) return NORTH;
  if (target[1] > my_y) {return SOUTH} else {return NORTH};
  if (target[0] > my_x) {return WEST} else {return EAST};

}


function quadrants(){
  var board = get_board(),
      my_x = get_my_x(),
      my_y = get_my_y(),
      width = board.length,
      height = board[0].length;

  function quad(n,limit,start,end){
    var quad = [];
    for (i=n;i<limit;i++){
      quad.push(board[i].slice(start,end));
    } 
    return quad;
  }

  var sw_quad = quad(0,my_x+1,my_y,height+1),
      se_quad = quad(my_x,width,my_y,height+1),
      nw_quad = quad(0,my_x+1,0,my_y+1),
      ne_quad = quad(my_x,width,0,my_y+1);

  function count_quad(quad){
    var count = 0;
    for (i=0;i<quad.length;i++){
      for (j=0;j<quad[i].length;j++){
        if (quad[i][j] !== 0) count++;
      }
    }
    return count;
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


  function fruits_in_quad(quad,x,y){
    var res = [];
      for (i=0;i<quad.length;i++){
        for (j=0;j<quad[i].length;j++){
          if (quad[i][j] !== 0) res.push([i+x,j+y]);
        }
      }
      return res;
  }

  var fruits_in_sw = fruits_in_quad(sw_quad,0,my_y),
      fruits_in_se = fruits_in_quad(se_quad,my_x,my_y),
      fruits_in_nw = fruits_in_quad(nw_quad,0,0),
      fruits_in_ne = fruits_in_quad(ne_quad,my_x,0);


  var res = {"sw_quad": sw_quad, "se_quad": se_quad, "nw_quad": nw_quad, "ne_quad": ne_quad};
  var res2 = [["sw_quad", count_quad(sw_quad)], ["se_quad", count_quad(se_quad)], ["nw_quad", count_quad(nw_quad)], ["ne_quad", count_quad(ne_quad)]];
  res2.sort(function(a,b){
    if (a[1] > b[1]) return -1;
    if (a[1] < b[1]) return 1;
    return 0;
  });
  //return res2[0][0];

  return count_types(sw_quad);


}

// Optionally include this function if you'd like to always reset to a 
// certain board number/layout. This is useful for repeatedly testing your
// bot(s) against known positions.
//
function default_board_number() {
    return 815692;
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
