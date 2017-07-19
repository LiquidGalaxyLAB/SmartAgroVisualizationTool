#!/usr/bin/env python
# -*- coding: utf-8 -*-
import simplekml

class OverlaysKml(object):
    name = None
    data = None
    kml_var = None

    def __init__(self, name, data):
        self.name = name
        self.data = data
        self.kml_var = simplekml.Kml()

    def makeKML(self):
        self.parseData()
        self.saveKml()

    def parseData(self):
        for element in self.data:
            self.newOverlay(element['name'], element['url'],
            element['coordinates'])

    def newOverlay(self, name, imageUrl, coordinates):
        new_overlay = self.kml_var.newgroundoverlay(name=name)
        self.addImage(new_overlay, imageUrl)
        self.addCoords(new_overlay, coordinates)

    def addImage(self, overlay, imageUrl):
        overlay.icon.href = imageUrl

    def addCoords(self, overlay, coordinates):
        aux_list = []
        aux_list.append((coordinates['lower-left'][0], coordinates['lower-left'][1]))
        aux_list.append((coordinates['lower-right'][0], coordinates['lower-right'][1]))
        aux_list.append((coordinates['upper-right'][0], coordinates['upper-right'][1]))
        aux_list.append((coordinates['upper-left'][0], coordinates['upper-left'][1]))
        overlay.gxlatlonquad.coords = aux_list

    def saveKml(self):
        self.kml_var.save("public/kmls/data/" + self.name + ".kml")
