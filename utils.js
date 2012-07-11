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
