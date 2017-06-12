import sys
import json
file = open('generateThis.json', 'r')
readVariable = file.read()
sensorsJson = json.loads(readVariable)
file = open('test.txt', 'w')
file.write(sensorsJson['name'])
file.close()
