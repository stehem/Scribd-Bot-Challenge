//http://www.scribd.com/jobs/botrace_api
//
//very very much a work in progress !!!

function new_game() {
}

function make_move() {
  var board = get_board();

  // we found an item! take it!
  if (board[get_my_x()][get_my_y()] > 0) {
    return TAKE;
  }

  find_closest(board);

  var rand = Math.random() * 4;

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

  var n = typeof nb !== "undefined" ? nb : 1;


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

  if (res2.length > 0){
    if (res2[0][1] < my_y){return NORTH;}
    if (res2[0][1] > my_y){return SOUTH;}
  
  
  }
}

// Optionally include this function if you'd like to always reset to a 
// certain board number/layout. This is useful for repeatedly testing your
// bot(s) against known positions.
//
function default_board_number() {
    return 123;
}

// homemade ghetto Filter
Array.prototype.remove_assoc_pair = function(arr){
  for (i=0;i<this.length;i++){
    if (this[i][0] === arr[0] && this[i][1] === arr[1]){
      this.splice(i,1);
      i--;
    }
  }
  return this;
}

