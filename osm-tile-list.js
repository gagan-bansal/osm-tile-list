#!/usr/bin/env node
var extract = require('geojson-extract-geometries')
var inside = require('point-in-polygon')
var extent = require('geojson-bbox')
var clipper = require('greiner-hormann')
var buffer = require('turf-buffer')
var fs = require('fs')
var path = require('path')
var argv = require('yargs')
  .usage('Usage:$0 <geojson-file> [options]')
  .demand(1)
  .option('s', {
    alias: 'minZoom',
    describe: 'Min zoom to be considered for list',
    type: 'number',
    default: 0
  })
  .option('e', {
    alias: 'maxZoom',
    describe: 'Max zoom to be considered for list',
    type: 'number',
    default: 18
  })
  .option('b', {
    describe: 'Extra number of tiles around polygon',
    alias: 'tileBuffer',
    type: 'number',
    default: 0
  })
  .help('h')
  .alias('h', 'help')
  .argv

fs.readFile(path.resolve(argv._[0]), function(err, data) {
  if (err) throw err
  var geojson = JSON.parse(data)
  var polygons = extract(geojson,'Polygon')
  var zooms = Array.apply(null, Array(argv.maxZoom - argv.minZoom + 1))
    .map(function(x, i) { return argv.minZoom + i})
  zooms.forEach(function(z) {
    polygons.forEach(function(poly) {
      if (argv.tileBuffer > 0) {
        var dist = (256 * argv.tileBuffer) * (256/180)/Math.pow(2,z)
        poly = buffer(poly, dist, 'degrees').geometry
      }
      var bbox = limitBounds(extent(poly))
      var top = lat2tile(bbox[3], z)
      var left = long2tile(bbox[0], z) 
      var bottom = lat2tile(bbox[1], z)
      var right = long2tile(bbox[2], z)
      for (var x = left; x <= right; x++) {
        for (var y = top; y <= bottom; y++) {
          var corners = tileCorners(z, x, y)
          var anyPointIn = corners 
            .every(function(pt) {
              return inside(pt,poly.coordinates[0])
            })
          if (anyPointIn) {
            console.log([z,x,y].join('/') + '.png')
          } else {
            var int = clipper.intersection(
              poly.coordinates[0].slice(0,-1),
              corners)
            if (int) console.log([z,x,y].join('/') + '.png')
          }
        }
      }
    })
  })
})

// get tile corner points
function tileCorners(z, x, y) {
  var top = tile2lat(y,z)
  var left = tile2long(x, z)
  var bottom = tile2lat(y+1, z)
  var right = tile2long(x+1, z)
  return [
    [left, bottom],
    [right, bottom],
    [right, top],
    [left, top]
  ]
}

// get tile numbers for lat, long and vice versa 
// http://wiki.openstreetmap.org/wiki/Slippy_map_tilenames 
// http://wiki.openstreetmap.org/wiki/Slippy_map_tilenames#ECMAScript_.28JavaScript.2FActionScript.2C_etc..29 (javascript code)
function long2tile(lon,zoom) { return (Math.floor((lon+180)/360*Math.pow(2,zoom))); }
function lat2tile(lat,zoom)  { return (Math.floor((1-Math.log(Math.tan(lat*Math.PI/180) + 1/Math.cos(lat*Math.PI/180))/Math.PI)/2 *Math.pow(2,zoom))); }
function tile2long(x,z) {
  return (x/Math.pow(2,z)*360-180);
}
function tile2lat(y,z) {
  var n=Math.PI-2*Math.PI*y/Math.pow(2,z);
  return (180/Math.PI*Math.atan(0.5*(Math.exp(n)-Math.exp(-n))));
}
//////

function limitBounds(bbox) {
  return [
    bbox[0] > -180 ? bbox[0] : -180 + 0.000001,
    bbox[1] > -85.0511 ? bbox[1] : -85.0511 + 0.000001,
    bbox[2] < 180 ? bbox[2] : 180 - 0.000001,
    bbox[3] < 85.0511 ? bbox[3] : 85.0511 - 0.000001
  ]
}

