import sys
import os

def createNetworkKml(kml_name):
    file = open("public/kmls/network/" + kml_name + "_link.kml", 'w')
    global_string = ""
    global_string += '<?xml version="1.0" encoding="UTF-8"?>\n\
                        <kml xmlns="http://www.opengis.net/kml/2.2">\n\
                        <NetworkLink>\n'

    global_string += "<Link>\n\
                        <href>http://10.160.67.210:3000/kmls/data/" + kml_name + ".kml" + "</href>\n\
                        <refreshMode>onInterval</refreshMode>\n\
                        <refreshInterval>20</refreshInterval>\n\
                        </Link>\n"
    global_string += "</NetworkLink>\n\
                        </kml>"
    file.write(global_string)
    file.close()

def generateKmlTxt(kml_name):
    f = open("public/kmls/help/kmls.txt", 'w')
    dir_path = "public/kmls/network/"
    list_dir = os.listdir(dir_path)
    for file in list_dir:
        f.write("http://10.160.67.210:3000/kmls/network/" + file + "\n")
    f.close()

def sendKml():
    filePath = "public/kmls/help/kmls.txt"
    lg_ip = "10.160.67.187"
    locPath = "/var/www/html/"
    os.system("sshpass -p 'lqgalaxy' scp " + filePath + " lg@" + lg_ip + ":" + locPath)

def main(kml_name):
    createNetworkKml(kml_name)
    generateKmlTxt(kml_name)
    sendKml()

if __name__ == "__main__":
    main(sys.argv[1])
