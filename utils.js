function has_fruits(quad){
  var board = get_board();
  for (i=0;i<quad.length;i++){
    if (board[quad[i][0]][quad[i][1]] > 0) return true;
  }
  return false;
}

function count_fruits_in_quad(quad){
  var res = 0;
  var board = get_board();
  for (i=0;i<quad.length;i++){
    if (board[quad[i][0]][quad[i][1]] > 0) res++;
  }
  return res;
}

function count_total_fruits(){
  var types = [1,2,3,4,5], res = 0;
  for (i=0;i<types.length;i++){
    res = res + (get_total_item_count(types[i]) || 0);
  }
  return res;
}

function find_closest(){
  var my_x = get_my_x(),
    my_y = get_my_y(),
    res = [],
    res2 = [],
    board = get_board(),
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
  return res2;
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
return res[0];
}

function get_best_in_quad(quad){
var best = best_to_eat(), best_type = best[0], diff = best[1];
res =[];
for (i=0;i<quad.length;i++){
var x = quad[i][0], y = quad[i][1];
if (board[x][y] === best_type && diff < 2) res.push(quad[i]);
}
if (res.length > 0) return res;
return quad[0];
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

  return res;
}


Array.prototype.filter_closest = function(score){
  var res2 = [];
  for (i=0;i<this.length;i++){
    if (this[i][0] === score) res2.push(this[i][1]) ;
  }

  if (res2.length > 1) return get_best_in_quad(res2);
  return res2[0];
}
