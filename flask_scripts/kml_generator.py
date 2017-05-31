import simplekml

class TemperatureKml(object):
    name = None
    data = None
    kml_var = None

    def __init__(self, name, data):
        self.name = name
        self.data = data
        self.kml_var = simplekml.Kml()

    def makeKml(self):
        self.parseData()
        self.saveKml()

    def parseData(self):
        for element in self.data:
            self.newPoint(element)

    def newPoint(self, temperature):
        new_point = self.kml_var.newpoint(name="Temperature")
        self.addDescription(new_point, temperature)
        self.addCoords(new_point, {'lng': 41.617599, 'lat': 0.626613})

    def addDescription(self, point, description):
        point.description = description

    def addCoords(self, point, coordinates):
        point.coords = [(coordinates['lng'], coordinates['lat'])]

    def saveKml(self):
        self.kml_var.save("./static/placemark.kml")
