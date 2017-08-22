#!/usr/bin/env python
# -*- coding: utf-8 -*-
import simplekml
from create_tour import addOverlayToTour

class OverlaysKml(object):
    name = None
    data = None
    kml_var = None
    playlist_var = None

    def __init__(self, name, data):
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
        for layer in self.data['layers']:
            overlay_id = self.newOverlay(layer['name'], layer['url'],
            self.data['corners'])
            addOverlayToTour(self.playlist_var, self.data['coordinates'], overlay_id)

    def newOverlay(self, name, imageUrl, coordinates):
        new_overlay = self.kml_var.newgroundoverlay(name=name)
        self.addImage(new_overlay, imageUrl)
        self.addCoords(new_overlay, coordinates)
        new_overlay.visibility = 0
        return new_overlay.id

    def addImage(self, overlay, imageUrl):
        overlay.icon.href = imageUrl

    def addCoords(self, overlay, coordinates):
        aux_list = []
        aux_list.append((coordinates['down-left'][0], coordinates['down-left'][1]))
        aux_list.append((coordinates['down-right'][0], coordinates['down-right'][1]))
        aux_list.append((coordinates['up-right'][0], coordinates['up-right'][1]))
        aux_list.append((coordinates['up-left'][0], coordinates['up-left'][1]))
        overlay.gxlatlonquad.coords = aux_list

    def saveKml(self):
        self.kml_var.save("public/kmls/data/" + self.name + ".kml")
