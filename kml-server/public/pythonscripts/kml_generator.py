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
    point['date'] = element['date']
    point['description'] = {}
    point['description'] = element['data']
    point['coordinates'] = {}
    point['coordinates']['lat'] = element['coords']['lat']
    point['coordinates']['lng'] = element['coords']['lng']
    data.append(point)
points = PointsKml(json_data['name'], data)
points.makeKML()

# file = open('test.txt', 'w')
# file.write(sensorsJson['name'])
# file.close()
