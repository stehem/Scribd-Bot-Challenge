//http://www.scribd.com/jobs/botrace_api
//
// v1, aka dumb bot, will eat the closest fruit waving its arms like he just don't care...



function make_move(){
  var turn = new Turn();
  return turn.direction;
}

var Turn = function(){
  this.board = get_board(),
  this.my_x = get_my_x(),
  this.my_y = get_my_y(),
  this.direction = this.init();
};


Turn.prototype.init = function(){
  if (this.board[this.my_x][this.my_y] > 0) {
    return TAKE;
  }
  return this.eat_closest() || this.go_towards_target(this.find_closest());
}

Turn.prototype.eat_closest = function(){
  if (has_item(this.board[this.my_x][this.my_y+1])) return SOUTH;
  if (this.board[this.my_x+1] && has_item(this.board[this.my_x+1][this.my_y])) return EAST;
  if (has_item(this.board[this.my_x][this.my_y-1])) return NORTH;
  if (this.board[this.my_x-1] && has_item(this.board[this.my_x-1][this.my_y])) return WEST;
}


Turn.prototype.find_closest = function(){
  var res = [], res2 = [], n = 1;
  while (res2.length == 0 && n < this.board.length){
    for (j=this.my_x-n;j<this.my_x+n+1;j++){
      for (i=this.my_y-n;i<this.my_y+n+1;i++){
        res.push([j,i]);
      }
    }
    for (i=0;i<res.length;i++){
      if (this.board[res[i][0]] && has_item(this.board[res[i][0]][res[i][1]])) 
      {res2.push(res[i]);}
    }
    res2.remove_assoc_pair([this.my_x, this.my_y]);
    n++;
  }
  for (i=0;i<res2.length;i++){
    res2[i].push(Math.abs(this.my_x - res2[i][0]) + Math.abs(this.my_y - res2[i][1]));
  }
  res2.assoc_sort_asc(2);
  return res2[0].slice(0,2);
}
  

Turn.prototype.go_towards_target = function(target){
  if (target[1] === this.my_y && this.my_x < target[0]) return EAST;
  if (target[1] === this.my_y && this.my_x > target[0]) return WEST;
  if (target[0] === this.my_x && this.my_y < target[1]) return SOUTH;
  if (target[0] === this.my_x && this.my_y > target[1]) return NORTH;
  if (target[1] > this.my_y) {return SOUTH} else {return NORTH};
  if (target[0] > this.my_x) {return WEST} else {return EAST};
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
