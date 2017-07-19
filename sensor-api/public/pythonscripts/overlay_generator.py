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

data = []
for element in json_data['images']:
    overlay = {}
    overlay['name'] = element['name']
    overlay['url'] = element['url']
    overlay['coordinates'] = {}
    overlay['coordinates']['lower-left'] = element['coords']['lower-left']
    overlay['coordinates']['lower-right'] = element['coords']['lower-right']
    overlay['coordinates']['upper-right'] = element['coords']['upper-right']
    overlay['coordinates']['upper-left'] = element['coords']['upper-left']
    data.append(overlay)
overlays = OverlaysKml(json_data['name'], data)
overlays.makeKML()
