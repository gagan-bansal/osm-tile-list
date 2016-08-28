# osm-tile-set
Create list of OSM tiles for geojson polygons
## installation

```
npm install osm-tile-set -g
```

## usage
```
Usage:osm-tile-list <geojson-file> [options]

Options:
  --minZoom, -s     Min zoom to be considered for list              [default: 0]
  --maxZoom, -e     Max zoom to be considered for list             [default: 18]
  --tileBuffer, -b  Extra number of tiles around polygon            [default: 0]
  --help, -h        Show help                                          [boolean]
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
## developing
Once you run
 
```npm isntall```

then for running test 

```npm run test```

to create build

```npm run build```

## license
This project is licensed under the terms of the MIT license.
