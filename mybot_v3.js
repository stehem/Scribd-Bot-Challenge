function make_move(){
  var turn = new Turn();
  return turn.direction;
}


function default_board_number(){
  return 709979;
}


var mybot = {
  target: undefined,
  type_priorities: undefined
}


var Turn = function(){
  this.direction = this.init();
}


Turn.prototype.init = function(){
  if (mybot.target !== undefined){
    var opponent_on_target = (get_opponent_x() === mybot.target[0]) && (get_opponent_y() === mybot.target[1]),
        target_taken = get_board()[get_my_x()][get_my_y()] === 0;
    if (opponent_on_target || target_taken) mybot.target = undefined;
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
  if (on_target || (on_fruit && prio_fruit && safe_distance)){
    return TAKE;
  } 
  return this.go_towards_target(mybot.target);
}


Turn.prototype.set_target = function(){
  var i = 1;
  while (this.left_of_type(i) === 0){i++};
  var half = this.half_with_most_type(i);
  var closest = this.get_closest_in_zone(half,i);
  mybot.target = closest;
}

Turn.prototype.go_towards_target = function(target){
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


Turn.prototype.type_priorities = function(){
  var res = {},
      res2 = [];
  for (i=1;i<get_number_of_item_types()+1;i++){
    res[i] = undefined;
  }
  for (i=1;i<get_number_of_item_types()+1;i++){
    res2.push([i, get_total_item_count(i)]);
  }
  res2.assoc_sort_asc(1);
  for (i=0;i<res2.length;i++){
    res[res2[i][0]] = res2[i][0];
  }
  return res;
}



Turn.prototype.half = function(start_x, limit_x, start_y, limit_y){
  var res = [];
  for (y=start_y;y<limit_y;y++){
    for (x=start_x;x<limit_x;x++){
      res.push([x,y]);
    }
  }
  return res;
}

Turn.prototype.half_with_most_type = function(type){
  var down = this.half(0,WIDTH,get_my_y(),HEIGHT),
      up = this.half(0,WIDTH,0,get_my_x()+1),
      right = this.half(get_my_x(),WIDTH,0,HEIGHT),
      left = this.half(0,get_my_x()+1,0,HEIGHT),
      count_up = this.count_types_in_zone(up, type),
      count_down = this.count_types_in_zone(down, type),
      count_right = this.count_types_in_zone(right, type),
      count_left = this.count_types_in_zone(left, type),
      counts = [[count_up,up],[count_down,down],[count_right,right],[count_left,left]];
  counts.assoc_sort_desc(0);
  return counts[0][1];
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


Array.prototype.filter_closest = function(score){
  var res = [];
  for (i=0;i<this.length;i++){
    if (this[i][0] === score) res.push(this[i][1]) ;
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

