#!/usr/bin/python

import sys
import os
from flask import jsonify
from flask import send_file
from flask import Flask, request, Response, render_template
from flask import json
from kml_generator import TemperatureKml

host = '0.0.0.0'
port = 5000
server_url = '/flasklistener'
value = []

app = Flask(__name__)

@app.route(server_url, methods=['POST'])
def listen():
    print 'HEY There is someone out there !'
    print request.method + ' ' + request.scheme + '://' + request.host + request.path + '\n'
    if ((request.data is not None) and (len(request.data) != 0)):
        aux = parseData(json.loads(request.data))
        print aux
        points = TemperatureKml('Temperature', aux)
        points.makeKml()
    return render_template('dashboard.html', temperature=0.0)

@app.route('/flasklistener', methods=['GET'])
def serve():
    print 'Serving...'
    print value
    data = value
    response = app.response_class(
        response=data,
        status=200,
        mimetype='application/json'
    )
    return response

def parseData(json_data):
    global value
    value = []
    for contextResponse in json_data['contextResponses']:
        for attribute in contextResponse['contextElement']['attributes']:
            value.append(attribute['value'])
    return value

@app.route('/dashboard')
def dashboard():
    global value
    return render_template('dashboard.html', temperature=value)

@app.route('/kml')
def serve_kml():
    return send_file('static/placemark.kml', mimetype='text/xml')

@app.route('/json')
def serve_json():
    return jsonify(temperature=value[0])

if __name__ == '__main__':
	print 'Flask started'
	app.run(host=host, port=port)
