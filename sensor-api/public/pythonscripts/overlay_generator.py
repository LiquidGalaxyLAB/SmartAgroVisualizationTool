import sys
import json

from generate_overlays import OverlaysKml

file = open('public/generators/generator.json', 'r')
readVariable = file.read()
json_data = json.loads(readVariable)

# In simplekml GroundOverlays:
# Four corners of quad coordinates, accepts list of four tuples in the order
# lon, lat.
# The coordinates must be specified in counter-clockwise order with the first
# coordinate corresponding to the lower-left corner of the overlayed image.
# eg. [(0, 1), (1,1), (1,0), (0,0)]

data = {}
data['layers'] = []
for image in json_data['images']:
    layer = {}
    layer['name'] = image['name']
    layer['url'] = image['url']
    data['layers'].append(layer)
data['corners'] = {}
data['corners']['down-left'] = json_data['corners']['down-left']
data['corners']['down-right'] = json_data['corners']['down-right']
data['corners']['up-right'] = json_data['corners']['up-right']
data['corners']['up-left'] = json_data['corners']['up-left']
data['coordinates'] = {}
data['coordinates']['lat'] = json_data['coordinates']['latitude']
data['coordinates']['lng'] = json_data['coordinates']['longitude']
overlays = OverlaysKml(json_data['name'], data)
overlays.makeKML()
