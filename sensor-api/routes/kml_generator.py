import sys
import json
from generate_points import PointsKml

file = open('public/generators/generator.json', 'r')
readVariable = file.read()
json_data = json.loads(readVariable)

data = []
for element in json_data['sensors']:
    point = {}
    point['name'] = element['name']
    point['description'] = element['data']['temperature']
    point['coordinates'] = {}
    point['coordinates']['lat'] = element['coords']['lat']
    point['coordinates']['lng'] = element['coords']['lng']
    data.append(point)
points = PointsKml('test', data)
points.makeKML()

# file = open('test.txt', 'w')
# file.write(sensorsJson['name'])
# file.close()
