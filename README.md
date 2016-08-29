# osm-tile-list
Create list of OSM tiles for geojson polygons
## installation

```
npm install osm-tile-list -g
```

## usage
```
Usage:osm-tile-list.js <geojson-file> [options]

Options:
  -s, --minZoom     Min zoom to be considered for list     [number] [default: 0]
  -e, --maxZoom     Max zoom to be considered for list    [number] [default: 18]
  -b, --tileBuffer  Extra number of tiles around polygon   [number] [default: 0]
  -h, --help        Show help                                          [boolean]
```
Output like:
```
5/23/12.png
5/23/13.png
5/23/14.png
5/23/15.png
5/24/13.png
6/48/30.png
6/44/30.png
6/45/30.png
6/44/29.png
6/44/30.png
``` 

## license
This project is licensed under the terms of the MIT license.
