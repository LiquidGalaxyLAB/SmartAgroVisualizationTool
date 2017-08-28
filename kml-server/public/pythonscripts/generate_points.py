#!/usr/bin/env python
# -*- coding: utf-8 -*-
import simplekml
import socket
from create_tour import addPointToTour

class PointsKml(object):
    # Ip to link balloon style to css static file in server
    ip = None
    # Nom (sera utilitzat per guardar el fitxer KML)
    name = None
    # Dades que seran "convertides" a placemarks
    data = None
    # Variable que guarda el kml de la llibreria simplekml
    kml_var = None
    # Variables fixes del placemarks
    # (el seu valor sera el mateix en qualsevol placemark)

    playlist_var = None

    def __init__(self, name, data):
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        self.ip = s.getsockname()[0]
        s.close()
        self.name = name
        self.data = data
        self.kml_var = simplekml.Kml()

    def makeKML(self):
        self.initTour()
        self.parseData()
        self.saveKml()

    def initTour(self):
        self.playlist_var = self.kml_var.newgxtour(name=self.name).newgxplaylist()

    def parseData(self):
        for element in self.data:
            placemark_id = self.newPoint(element['name'], element['date'],
            element['description'], element['coordinates'])
            addPointToTour(self.playlist_var, element['coordinates'], placemark_id)

    def newPoint(self, name, date, description, coordinates):
        new_point = self.kml_var.newpoint(name="")
        self.addDescription(new_point, name, date, description)
        self.addCoords(new_point, coordinates)
        self.addStyle(new_point)
        return new_point.placemark.id

    def addDescription(self, point, name, date, description):

        htmlString = '<link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet">'
        htmlString += '<link rel="stylesheet" type="text/css" href="http://' + self.ip + ':3003/stylesheets/sensor-theme.css">'

        htmlString += '<div class="table-title">\
                        <h3>'
        htmlString += str(name)
        htmlString += '</h3>\
                        </div>\
                    <div class="table-subtitle">\
                        <h2>'
        splitArray = str(date).split('T')
        htmlString += splitArray[0]
        htmlString += '<br>'
        htmlString += splitArray[1].split('.')[0]
        htmlString += '</h2>\
                    </div>\
                    <table class="table-fill">\
                    <thead>\
                        <tr>\
                        <th class="text-left">'
        htmlString += 'Attribute'
        htmlString += '</th>\
                    <th class="text-left">'
        htmlString += 'Value'
        htmlString += '</th>\
                    </tr>\
                    </thead>\
                    <tbody class="table-hover">'

        for k, v in description.iteritems():
            valuesString = '<tr>\
                            <td class="text-left">'
            valuesString += str(k)
            valuesString += '</td>\
                            <td class="text-left">'
            valuesString += str(v)
            valuesString += '</td>\
                            </tr>'
            htmlString += valuesString

        htmlString += '</tbody>\
                    </table>'

        point.description = htmlString

    def addCoords(self, point, coordinates):
        # Longitude, Latitude, optional height
        # Thinking of join coordinates in a list (not in a dict with keys)
        point.coords = [(coordinates['lng'], coordinates['lat'])]

    def addAddress(self, point, address):
        point.address = address

    def addAltitudemode(self, point, altitudemode):
        point.altitudemode = altitudemode

    def addImage(self, point, image):
        point.description = "<img src='" + image + "' width='500' />"

    def addStyle(self, point):
        point.style.labelstyle.color = simplekml.Color.green
        point.style.iconstyle.icon.href = 'http://maps.google.com/mapfiles/kml/shapes/target.png'
        point.style.balloonstyle.text = '$[description]'

    def saveKml(self):
        self.kml_var.save("public/kmls/data/" + self.name + ".kml")

'''
A simplekml point has these attributes:
address, altitudemode, atomauthor, atomlink, balloonstyle, camera, coords,
description, extendeddata, extrude, gxaltitudemode, gxballoonvisibility, iconstyle,
id, labelstyle, linestyle, lookat, name, phonenumber, placemark, polystyle, region,
snippet, style, stylemap, timespan, timestamp, visibility i xaladdressdetails
'''
