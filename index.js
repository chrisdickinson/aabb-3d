module.exports = AABB

var vec3 = require('gl-matrix').vec3

function AABB(pos, vec) {

  if(!(this instanceof AABB)) {
    return new AABB(pos, vec)
  }

  var pos2 = vec3.create()
  vec3.add(pos2, pos, vec)
 
  this.base = vec3.min(vec3.create(), pos, pos2)
  this.vec = vec
  this.max = vec3.max(vec3.create(), pos, pos2)

  this.mag = vec3.length(this.vec)

}

var cons = AABB
  , proto = cons.prototype

proto.width = function() {
  return this.vec[0]
}

proto.height = function() {
  return this.vec[1]
}

proto.depth = function() {
  return this.vec[2]
}

proto.x0 = function() {
  return this.base[0]
}

proto.y0 = function() {
  return this.base[1]
}

proto.z0 = function() {
  return this.base[2]
}

proto.x1 = function() {
  return this.max[0]
}

proto.y1 = function() {
  return this.max[1]
}

proto.z1 = function() {
  return this.max[2]
}

proto.translate = function(by) {
  vec3.add(this.max, this.max, by)
  vec3.add(this.base, this.base, by)
  return this
}

proto.expand = function(aabb) {
  var max = vec3.create()
    , min = vec3.create()

  vec3.max(max, aabb.max, this.max)
  vec3.min(min, aabb.base, this.base)
  vec3.sub(max, max, min)

  return new AABB(min, max)
}

proto.intersects = function(aabb) {
  if(aabb.base[0] > this.max[0]) return false
  if(aabb.base[1] > this.max[1]) return false
  if(aabb.base[2] > this.max[2]) return false
  if(aabb.max[0] < this.base[0]) return false
  if(aabb.max[1] < this.base[1]) return false
  if(aabb.max[2] < this.base[2]) return false

  return true
}

proto.touches = function(aabb) {

  var intersection = this.union(aabb);

  return (intersection !== null) &&
         ((intersection.width() == 0) ||
         (intersection.height() == 0) || 
         (intersection.depth() == 0))

}

proto.union = function(aabb) {
  if(!this.intersects(aabb)) return null

  var base_x = Math.max(aabb.base[0], this.base[0])
    , base_y = Math.max(aabb.base[1], this.base[1])
    , base_z = Math.max(aabb.base[2], this.base[2])
    , max_x = Math.min(aabb.max[0], this.max[0])
    , max_y = Math.min(aabb.max[1], this.max[1])
    , max_z = Math.min(aabb.max[2], this.max[2])

  return new AABB([base_x, base_y, base_z], [max_x - base_x, max_y - base_y, max_z - base_z])
}




