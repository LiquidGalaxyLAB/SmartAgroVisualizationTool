import sys
import os
import datetime
import time
import socket

def generateKmlTxt(kml_name, serverIp):
    f = open("public/kmls/help/kmls.txt", 'w')
    time_number = str(datetime.datetime.now())
    f.write("http://" + serverIp + ":3003/kmls/data/" + kml_name + ".kml" + "?v=" + time_number)
    f.close()

def sendKml(lgIp):
    filePath = "public/kmls/help/kmls.txt"
    locPath = "/var/www/html/"
    # os.system("ssh-keyscan -H " + lgIp + " >> ~/.ssh/known_hosts")
    os.system("sshpass -p 'lqgalaxy' scp " + filePath + " lg@" + lgIp + ":" + locPath)

def stopTour(lgIp):
    command = "echo 'exittour=true' | sshpass -p 'lqgalaxy' ssh lg@" + lgIp + \
              " 'cat - > /tmp/query.txt'"
    os.system(command)

def playTour(tour_name, lgIp):
    stopTour(lgIp)
    time.sleep(2)
    command = "echo 'playtour="+ tour_name +"' | sshpass -p 'lqgalaxy'\
                 ssh lg@" + lgIp + " 'cat - > /tmp/query.txt'"
    os.system(command)

def updateStyle(serverIp):
    filePath = "public/kmls/templates/demoSensors.kml"
    with open(filePath, 'r') as myfile:
        data=myfile.read().replace('IP_TO_REPLACE', serverIp)
    myfile.close()
    f = open("public/kmls/data/demoSensors.kml", 'w')
    f.write(data)
    f.close()

def updateImageSource(serverIp):
    filePath = "public/kmls/templates/demoOverlays.kml"
    with open(filePath, 'r') as myfile:
        data=myfile.read().replace('IP_TO_REPLACE', serverIp)
    myfile.close()
    f = open("public/kmls/data/demoOverlays.kml", 'w')
    f.write(data)
    f.close()

def main(kml_name, lgIp):
    
    if kml_name == 'stop':
        stopTour(lgIp)
    else:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        serverIp = s.getsockname()[0]
        s.close()
        if kml_name == 'demoSensors':
            updateStyle(serverIp)
        elif kml_name == 'demoOverlays':
            updateImageSource(serverIp)
        generateKmlTxt(kml_name, serverIp)
        sendKml(lgIp)
        playTour(kml_name, lgIp)

if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
