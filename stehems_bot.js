function make_move(){
  var turn = new Turn();
  return turn.direction;
}


var mybot = {
  target: undefined
}


var Turn = function(){
  this.direction = this.init();
}


Turn.prototype.init = function(){
  if (mybot.target !== undefined){
    var opponent_on_target = (get_opponent_x() === mybot.target[0]) && (get_opponent_y() === mybot.target[1]),
        target_taken = get_board()[mybot.target[0]][mybot.target[1]] === 0,
        target_type = get_board()[mybot.target[0]][mybot.target[1]],
        too_late = this.opp_has_majority(target_type),
        too_many = this.i_have_majority(target_type);

    if (opponent_on_target || target_taken || too_late || too_many) mybot.target = undefined;
  }
  if (mybot.target === undefined) this.set_target();
  var on_target = mybot.target[0] === get_my_x() && mybot.target[1] === get_my_y(),
      on_fruit = get_board()[get_my_x()][get_my_y()] > 0,
      fruit_type = get_board()[get_my_x()][get_my_y()],
      prio_fruit = this.prio_fruit(fruit_type),
      pos_target = mybot.target,
      pos_player =  [get_my_x(),get_my_y()],
      pos_opponent =  [get_opponent_x(),get_opponent_y()],
      my_dist_from_target = this.distance_from_target(pos_target, pos_player),
      opp_dist_from_target = this.distance_from_target(pos_target, pos_opponent),
      safe_distance = opp_dist_from_target-my_dist_from_target>=2;
  if (on_target || (on_fruit && safe_distance)){
    return TAKE;
  } 
  return this.go_towards_target(mybot.target);
}


Turn.prototype.set_target = function(){
  var i = 1;
  while (this.left_of_type(i) === 0 || this.opp_has_majority(i) || this.i_have_majority(i)){i++};
  var zone = this.zone_with_most_type(i);
  var closest = this.get_closest_in_zone(zone,i);
  mybot.target = closest;
}

Turn.prototype.go_towards_target = function(target){
  var path = this.best_path_to_target(), row = path[0], col = path[1];
  // that's awful :-/
  if (get_my_y() < row) {return SOUTH};
  if (get_my_y() > row) {return NORTH};
  if (get_my_y() === row && get_my_x() < col) {return EAST};
  if (get_my_y() === row && get_my_x() > col) {return WEST};
  if (get_my_x() < col) {return EAST};
  if (get_my_x() > col) {return WEST};
  if (get_my_x() === col && get_my_y() < row) {return NORTH};
  if (get_my_x() === col && get_my_y() > row) {return SOUTH};
  if (target[1] === get_my_y() && get_my_x() < target[0]) return EAST;
  if (target[1] === get_my_y() && get_my_x() > target[0]) return WEST;
  if (target[0] === get_my_x() && get_my_y() < target[1]) return SOUTH;
  if (target[0] === get_my_x() && get_my_y() > target[1]) return NORTH;
  if (target[1] > get_my_y()) {return SOUTH} else {return NORTH};
  if (target[0] > get_my_x()) {return WEST} else {return EAST};
}


Turn.prototype.distance_from_target = function(pos_target,pos_player){
  return Math.abs(pos_target[0]-pos_player[0])+Math.abs(pos_target[1]-pos_player[1]);
}


Turn.prototype.prio_fruit = function(type){
  return type <= Math.floor(((get_number_of_item_types()/2)+1));
}


Turn.prototype.opp_has_majority = function(type){
  if (get_opponent_item_count(type) > (get_total_item_count(type)/2)) return true;
  return false;
}


Turn.prototype.i_have_majority = function(type){
  if (get_my_item_count(type) > (get_total_item_count(type)/2)) return true;
  return false;
}


Turn.prototype.zone = function(start_x, limit_x, start_y, limit_y){
  var res = [];
  for (y=start_y;y<limit_y;y++){
    for (x=start_x;x<limit_x;x++){
      res.push([x,y]);
    }
  }
  return res;
}


Turn.prototype.zone_with_most_type = function(type){
 var down = this.zone(0,WIDTH,get_my_y(),HEIGHT),
      up = this.zone(0,WIDTH,0,get_my_x()+1),
      right = this.zone(get_my_x(),WIDTH,0,HEIGHT),
      left = this.zone(0,get_my_x()+1,0,HEIGHT),
      count_up = this.count_types_in_zone(up, type),
      count_down = this.count_types_in_zone(down, type),
      count_right = this.count_types_in_zone(right, type),
      count_left = this.count_types_in_zone(left, type),
      counts = [[count_up,up],[count_down,down],[count_right,right],[count_left,left]];
  counts.assoc_sort_desc(0);
  var zones = counts.filter_closest(counts[0][0]);
  if (zones.length === 1) {return zones[0][1]} else {
    if (this.count_types_in_zone(zones[0][1], type+1) > this.count_types_in_zone(zones[1][1], type+1)){
      return zones[0][1];
    } else {
      return zones[1][1];
    }
  }
}


Turn.prototype.count_types_in_zone = function(zone,type){
  var res = 0;
  for (i=0;i<zone.length;i++){
    var x = zone[i][0], y = zone[i][1];
    if (get_board()[x][y] === type) res++;
  }
  return res;
}


Turn.prototype.get_closest_in_zone = function(zone, type){
  var res = [];
  for (i=0;i<zone.length;i++){
    var x = zone[i][0], y = zone[i][1];
    var r = get_board()[x][y];
    if (r === type) {
      res.push([Math.abs(get_my_x()-x)+Math.abs(get_my_y()-y),zone[i]]);
    }
  }
  res.assoc_sort_asc(0);
  return res[0][1];
}


Turn.prototype.left_of_type = function(type){
  return get_total_item_count(type) - get_my_item_count(type) - get_opponent_item_count(type);
}


Turn.prototype.best_path_to_target = function(){
  var target = mybot.target, position = [get_my_x(),get_my_y()],
      x = Math.abs(target[0] - position[0]), y = Math.abs(target[1] - position[1]), rows = [], cols = [];
  for(
    i=get_my_y();
    get_my_y() > target[1] ? i>=target[1] : i<get_my_y()+y+1;
    get_my_y() > target[1] ? i-- : i++){
      var row = [];
        for(
          j=get_my_x();
          get_my_x() > target[0] ? j>=target[0] : j<get_my_x()+x+1;
          get_my_x() > target[0] ? j-- : j++){
            row.push([j,i]);
          }
        rows.push(row);
    }
  for(
    k=get_my_x();
    get_my_x() > target[0] ? k>=target[0] : k<get_my_x()+x+1;
    get_my_x() > target[0] ? k-- : k++){
      var col = [];
      for(
        l=get_my_y();
        get_my_y() > target[1] ? l>=target[1] : l<get_my_y()+y+1;
        get_my_y() > target[1] ? l-- : l++){
          col.push([k,l]);
        }
        cols.push(col);
    }
  var res_rows = [], res_cols =[];
  for (m=0;m<rows.length;m++){
    res_rows.push([this.count_fruits_in_zone(rows[m]), rows[m]]);
  }

  res_rows.assoc_sort_desc(0);

  for (n=0;n<cols.length;n++){
    res_cols.push([this.count_fruits_in_zone(cols[n]), cols[n]]);
  }

  res_rows.assoc_sort_desc(0);
  res_cols.assoc_sort_desc(0);
    
  return [res_rows[0][1][0][1],res_cols[0][1][0][0]];
}


Turn.prototype.count_fruits_in_zone = function(zone,type){
  var res = 0;
  for (i=0;i<zone.length;i++){
    var x = zone[i][0], y = zone[i][1];
    if (get_board()[x][y] !== 0){
      if (this.prio_fruit(get_board()[x][y])) {res = res + 5} else {res++};
    }
  }
  return res;
}


Turn.prototype.prio_fruit = function(type){
  if (this.opp_has_majority(type)) return false;
  if (this.i_have_majority(type)) return false;
  if (!(type <= Math.floor(((get_number_of_item_types()/2)+1))) && !this.opp_has_majority(type) && !this.i_have_majority(type)) return true;
  if ((this.left_of_type(type) > 0) && (Math.abs(get_opponent_item_count(type)-get_my_item_count(type)) === 1)) return true;
  if ((this.left_of_type(type) > 0) && (get_opponent_item_count(type)-get_my_item_count(type) === 0)) return true;
  return type <= Math.floor(((get_number_of_item_types()/2)+1));
}


// homemade array utility functions
Array.prototype.filter_closest = function(score){
  var res = [];
  for (i=0;i<this.length;i++){
    if (this[i][0] === score) res.push(this[i]) ;
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



