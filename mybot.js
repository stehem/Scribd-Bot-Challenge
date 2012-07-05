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

  for (i=0;i<res2.length;i++){
    res2[i].push(Math.abs(my_x - res2[i][0]) + Math.abs(my_y - res2[i][1]));
  }

  res2.sort(function(a,b){
    if (a[2] < b[2]) return -1;
    if (a[2] > b[2]) return 1;
    return 0;
  });

  var target = res2[0].slice(0,2); 

  if (typeof quadrant === 'undefined') quadrant = [my_x,my_y];
  console.log(quadrant);

  if (target[1] === my_y && my_x < target[0]) return EAST;
  if (target[1] === my_y && my_x > target[0]) return WEST;
  if (target[0] === my_x && my_x < target[1]) return SOUTH;
  if (target[0] === my_x && my_x > target[1]) return NORTH;
  if (target[1] > my_y) {return SOUTH} else {return NORTH};
  if (target[0] > my_x) {return WEST} else {return EAST};

}

// Optionally include this function if you'd like to always reset to a 
// certain board number/layout. This is useful for repeatedly testing your
// bot(s) against known positions.
//
function default_board_number() {
    return 815692;
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

