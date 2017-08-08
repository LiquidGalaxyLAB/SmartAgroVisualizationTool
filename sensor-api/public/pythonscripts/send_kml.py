import sys
import os
import datetime

def generateKmlTxt(kml_name):
    f = open("public/kmls/help/kmls.txt", 'w')
    time_number = str(datetime.datetime.now())
    f.write("http://10.160.67.190:3000/kmls/data/" + kml_name + ".kml" + "?v=" + time_number)
    f.close()

def sendKml():
    filePath = "public/kmls/help/kmls.txt"
    lg_ip = "10.160.67.206"
    locPath = "/var/www/html/"
    # os.system("ssh-keyscan -H " + lg_ip + " >> ~/.ssh/known_hosts")
    os.system("sshpass -p 'lqgalaxy' scp " + filePath + " lg@" + lg_ip + ":" + locPath)

def main(kml_name):
    generateKmlTxt(kml_name)
    sendKml()

if __name__ == "__main__":
    main(sys.argv[1])
