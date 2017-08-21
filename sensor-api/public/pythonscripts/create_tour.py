#!/usr/bin/env python
# -*- coding: utf-8 -*-

import simplekml

def addPointToTour(playlist, coordinates, placemark_id):
    latitude = coordinates['lat']
    longitude = coordinates['lng']

    flyTo(playlist, latitude, longitude, 1000, 5000, 5.0, 77)
    playlist.newgxwait(gxduration=5.0)

    animatedupdateshow = playlist.newgxanimatedupdate(gxduration=5.0)
    animatedupdateshow.update.change = '<Placemark targetId="{0}">' \
                                        '<gx:balloonVisibility>1</gx:balloonVisibility></Placemark>' \
        .format(placemark_id)

    rotate(playlist, latitude, longitude, 1000, 5000, 77)
    playlist.newgxwait(gxduration=5.0)

    animatedupdateshow = playlist.newgxanimatedupdate(gxduration=0.1)
    animatedupdateshow.update.change = '<Placemark targetId="{0}">' \
                                       '<gx:balloonVisibility>0</gx:balloonVisibility></Placemark>' \
        .format(placemark_id)

def addOverlayToTour(playlist, coordinates, overlay_id):
    latitude = coordinates['lat']
    longitude = coordinates['lng']

    flyTo(playlist, latitude, longitude, 250, 500, 5.0, 60)
    playlist.newgxwait(gxduration=5.0)

    animatedupdateshow = playlist.newgxanimatedupdate(gxduration=5.0)
    animatedupdateshow.update.change = '<GroundOverlay targetId="{0}">' \
                                        '<visibility>1</visibility></GroundOverlay>' \
        .format(overlay_id)

    rotate(playlist, latitude, longitude, 250, 500, 60)
    playlist.newgxwait(gxduration=5.0)

    animatedupdateshow = playlist.newgxanimatedupdate(gxduration=0.1)
    animatedupdateshow.update.change = '<GroundOverlay targetId="{0}">' \
                                       '<visibility>0</visibility></GroundOverlay>' \
        .format(overlay_id)

# Code extracted from navijo's FlOYBD project:
# https://github.com/navijo/FlOYBD
def flyTo(playlist, latitude, longitude, altitude, pRange, duration, tilt):
    flyto = playlist.newgxflyto(gxduration=duration)
    flyto.gxflytomode = simplekml.GxFlyToMode.smooth
    flyto.altitudemode = simplekml.AltitudeMode.relativetoground

    flyto.lookat.gxaltitudemode = simplekml.GxAltitudeMode.relativetoseafloor
    flyto.lookat.longitude = float(longitude)
    flyto.lookat.latitude = float(latitude)
    flyto.lookat.altitude = altitude
    flyto.lookat.heading = 0
    flyto.lookat.tilt = tilt
    flyto.lookat.range = pRange

def rotate(playlist, latitude, longitude, altitude, pRange, tilt):
    for angle in range(0, 360, 10):
        flyto = playlist.newgxflyto(gxduration=1.0)
        flyto.gxflytomode = simplekml.GxFlyToMode.smooth
        flyto.altitudemode = simplekml.AltitudeMode.relativetoground

        flyto.lookat.gxaltitudemode = simplekml.GxAltitudeMode.relativetoseafloor
        flyto.lookat.longitude = float(longitude)
        flyto.lookat.latitude = float(latitude)
        flyto.lookat.altitude = altitude
        flyto.lookat.heading = angle
        flyto.lookat.tilt = tilt
        flyto.lookat.range = pRange
