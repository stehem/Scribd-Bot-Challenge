//http://www.scribd.com/jobs/botrace_api
//
// v1, aka dumb bot, will eat the closest fruit waving its arms like he just don't care...



function make_move() {
  var board = get_board();
  if (board[get_my_x()][get_my_y()] > 0) {
    return TAKE;
  }
  return eat_closest() || go_towards_target(find_closest());
}


function eat_closest(){
  var board = get_board();
  if (has_item(board[get_my_x()][get_my_y()+1])) return SOUTH;
  if (board[get_my_x()+1] && has_item(board[get_my_x()+1][get_my_y()])) return EAST;
  if (has_item(board[get_my_x()][get_my_y()-1])) return NORTH;
  if (board[get_my_x()-1] && has_item(board[get_my_x()-1][get_my_y()])) return WEST;
}


function find_closest(){
  var board = get_board(),
      my_x = get_my_x(),
      my_y = get_my_y(),
      res = [],
      res2 = [],
      n = 1;
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


 

// Optionally include this function if you'd like to always reset to a 
// certain board number/layout. This is useful for repeatedly testing your
// bot(s) against known positions.
//
function default_board_number() {
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
