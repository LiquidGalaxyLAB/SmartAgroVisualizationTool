import sys
sensorList = sys.argv[1]
file = open('test.txt', 'w')
file.write(sensorList[0].name)
file.close();
