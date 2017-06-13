#!/usr/bin/env python
# -*- coding: utf-8 -*-
import simplekml

class PointsKml(object):
    # Nom (sera utilitzat per guardar el fitxer KML)
    name = None
    # Dades que seran "convertides" a placemarks
    data = None
    # Variable que guarda el kml de la llibreria simplekml
    kml_var = None
    # Variables fixes del placemarks
    # (el seu valor sera el mateix en qualsevol placemark)


    def __init__(self, name, data):
        self.name = name
        self.data = data
        self.kml_var = simplekml.Kml()

    def makeKML(self):
        self.parseData()
        self.saveKml()

    def parseData(self):
        for element in self.data:
            self.newPoint(element['name'], str(element['description']),
            element['coordinates'])

    def newPoint(self, name, description, coordinates):
        new_point = self.kml_var.newpoint(name=name)
        self.addDescription(new_point, description)
        self.addCoords(new_point, coordinates)

    def addDescription(self, point, description):
        point.description = description

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

    def saveKml(self):
        self.kml_var.save("public/kmls/" + self.name + ".kml")

'''
A simplekml point has these attributes:
address, altitudemode, atomauthor, atomlink, balloonstyle, camera, coords,
description, extendeddata, extrude, gxaltitudemode, gxballoonvisibility, iconstyle,
id, labelstyle, linestyle, lookat, name, phonenumber, placemark, polystyle, region,
snippet, style, stylemap, timespan, timestamp, visibility i xaladdressdetails
'''
