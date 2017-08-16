import sys
import os
import datetime
import time

def generateKmlTxt(kml_name):
    f = open("public/kmls/help/kmls.txt", 'w')
    time_number = str(datetime.datetime.now())
    f.write("http://10.160.67.190:3000/kmls/data/" + kml_name + ".kml" + "?v=" + time_number)
    f.close()

def generateTour(tour_name):
    f = open("public/kmls/help/query.txt", 'w')
    f.write("playtour=" + '"' + tour_name + '"')

def sendKml():
    filePath = "public/kmls/help/kmls.txt"
    lg_ip = "10.160.67.206"
    locPath = "/var/www/html/"
    # os.system("ssh-keyscan -H " + lg_ip + " >> ~/.ssh/known_hosts")
    os.system("sshpass -p 'lqgalaxy' scp " + filePath + " lg@" + lg_ip + ":" + locPath)

def stopTour():
    lg_ip = "10.160.67.206"
    command = "echo 'exittour=true' | sshpass -p 'lqgalaxy' ssh lg@" + lg_ip + \
              " 'cat - > /tmp/query.txt'"
    os.system(command)

def playTour(tour_name):
    stopTour()
    time.sleep(2)
    lg_ip = "10.160.67.206"
    command = "echo 'playtour="+ tour_name +"' | sshpass -p 'lqgalaxy'\
                 ssh lg@" + lg_ip + " 'cat - > /tmp/query.txt'"
    os.system(command)

def main(kml_name):
    generateKmlTxt(kml_name)
    sendKml()
    playTour(kml_name)

if __name__ == "__main__":
    main(sys.argv[1])
