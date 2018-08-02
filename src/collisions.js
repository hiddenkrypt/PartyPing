module.exports = {
  circle_AABB:circle_AABB,
  point_AABB:point_AABB,
  point_Circle:point_Circle,
  circle_AALineSegment:circle_AALineSegment,
  distance:distance
};

/* circle to axis-aligned bounding box coliision*/
function circle_AABB(circle, aabb){
  return point_AABB(circle, aabb) ||
    circle_LineSegment(circle, {x:aabb.x, y:aabb.y}, {x:aabb.x+aabb.w, y:aabb.y}) || // TL-TR
    circle_LineSegment(circle, {x:aabb.x, y:aabb.y}, {x:aabb.x, y:aabb.y+aabb.h}) || // TL- BL
    circle_LineSegment(circle, {x:aabb.x+aabb.w, y:aabb.y+aabb.h}, {x:aabb.x+aabb.w, y:aabb.y}) || //BR-TR
    circle_LineSegment(circle, {x:aabb.x+aabb.w, y:aabb.y+aabb.h}, {x:aabb.x, y:aabb.y+aabb.h}); //BR-BL
}

/* point within axis-aligned bounding box*/
function point_AABB(point, aabb){
  return point.x > aabb.x &&
  point.x < aabb.x + aabb.w &&
  point.y > aabb.y &&
  point.y < aabb.y+aabb.h;
}

/* point within a circle */
function point_Circle(point, circle){
  return distance(circle, point) < circle.radius;
}

/*circle to Axis-Aligned Line Segment Collision */
function circle_AALineSegment(circle, a, b){
  if(circle.x > ax && circle.x < bx){ //above or below hoizontal line segment
    return  point_Circle(a, circle) || //end point test
      point_Circle(b, circle) || //end point test
      Math.abs(circle.y - ay) < circle.size; //intersecting middle
  }
  if(circle.y > ay && circle.y < by){ //left or right of vertical line segment
    return point_Circle(a, circle) || //end point test
      point_Circle(b, circle) || //end point test
      Math.abs(circle.x - ax) < circle.size; //intersecting middle
  }
  return false;
}

/* Distance between two points (objects with x and y coords) */
function distance(a,b){
  return Math.sqrt(Math.abs((a.x-b.x)*(a.x-b.x))+Math.abs((a.y-b.y)*(a.y-b.y)));
}
