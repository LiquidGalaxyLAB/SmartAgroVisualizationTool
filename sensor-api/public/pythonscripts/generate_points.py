#!/usr/bin/env python
# -*- coding: utf-8 -*-
import simplekml
from create_tour import addPointToTour

class PointsKml(object):
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

        htmlString += '''<style>
body {
  background-color: #00897B;
  font-family: "Roboto", helvetica, arial, sans-serif;
  font-size: 16px;
  font-weight: 400;
  text-rendering: optimizeLegibility;
  overflow-x: hidden;
}

div.table-title {
  display: block;
  margin: auto;
  max-width: 600px;
  padding:5px;
  width: 100%;
  text-align: center;
}

div.table-subtitle {
  display: block;
  margin: auto;
  max-width: auto;
  padding: 1px;
  width: 100%;
  text-align: center;
}

.table-title h3 {
   color: #fafafa;
   font-size: 30px;
   font-weight: 400;
   font-style:normal;
   font-family: "Roboto", helvetica, arial, sans-serif;
   text-shadow: -1px -1px 1px rgba(0, 0, 0, 0.1);
   text-transform:uppercase;
}


/*** Table Styles **/

.table-fill {
  background: white;
  border-radius:3px;
  border-collapse: collapse;
  height: 320px;
  margin: auto;
  max-width: 600px;
  padding:5px;
  width: 100%;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
  animation: float 5s infinite;
}

th {
  color:#D5DDE5;;
  background:#1b1e24;
  border-bottom:4px solid #9ea7af;
  border-right: 1px solid #343a45;
  font-size:23px;
  font-weight: 100;
  padding:24px;
  text-align:left;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
  vertical-align:middle;
}

th:first-child {
  border-top-left-radius:3px;
}

th:last-child {
  border-top-right-radius:3px;
  border-right:none;
}

tr {
  border-top: 1px solid #C1C3D1;
  border-bottom-: 1px solid #C1C3D1;
  color:#666B85;
  font-size:16px;
  font-weight:normal;
  text-shadow: 0 1px 1px rgba(256, 256, 256, 0.1);
}

tr:hover td {
  background:#4E5066;
  color:#FFFFFF;
  border-top: 1px solid #22262e;
  border-bottom: 1px solid #22262e;
}

tr:first-child {
  border-top:none;
}

tr:last-child {
  border-bottom:none;
}

tr:nth-child(odd) td {
  background:#EBEBEB;
}

tr:nth-child(odd):hover td {
  background:#4E5066;
}

tr:last-child td:first-child {
  border-bottom-left-radius:3px;
}

tr:last-child td:last-child {
  border-bottom-right-radius:3px;
}

td {
  background:#FFFFFF;
  padding:20px;
  text-align:left;
  vertical-align:middle;
  font-weight:300;
  font-size:18px;
  text-shadow: -1px -1px 1px rgba(0, 0, 0, 0.1);
  border-right: 1px solid #C1C3D1;
}

td:last-child {
  border-right: 0px;
}

th.text-left {
  text-align: left;
}

th.text-center {
  text-align: center;
}

th.text-right {
  text-align: right;
}

td.text-left {
  text-align: left;
}

td.text-center {
  text-align: center;
}

td.text-right {
  text-align: right;
}
</style>
'''

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
