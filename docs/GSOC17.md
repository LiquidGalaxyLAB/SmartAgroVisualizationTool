# Google Summer of Code 2017 - Javier Calvo García

> Project created for **Liquid Galaxy** [organization](https://github.com/LiquidGalaxyLAB).

Smart Agro Visualization Tool has been developed through two repositories:
- [SAVT-Dashboard](https://github.com/calv00/SAVT-Dashboard)
- [SmartAgroVisualizationTool](https://github.com/calv00/SmartAgroVisualizationTool)

With the next list of commits made in GSOC development stage:
- [SAVT-Dashboard commit list](https://github.com/calv00/SAVT-Dashboard/commits/master)
- [SmartAgroVisualizationTool commit list](https://github.com/calv00/SmartAgroVisualizationTool/commits/master)

## Summary
The main objective of this project has been to create a web application that facilitates the visualization of smart agricultural information (sensors and drone field images) to inexperienced computer science users.

To accomplish this goal, it has been developed a NodeJS API server ([sensor-api](https://github.com/calv00/SmartAgroVisualizationTool/tree/master/sensor-api)) to save the *Smart Agro* data, ready to be deployed on a public server/address. This data is transformed in a local NodeJS API server ([kml-server](https://github.com/calv00/SmartAgroVisualizationTool/tree/master/kml-server)) by a collection of Python scripts to generate KML files that will deploy the information on a Liquid Galaxy system.
The interaction between the user, the data and the Liquid Galaxy is possible by the creation of an Angular web app ([SAVT-Dashboard](https://github.com/calv00/SAVT-Dashboard)) that has been developed with Angular Material components to let the user contemplate all the available values of the sensors and all agricultural drone images uploaded to the server, and select any value to display its information on the Liquid Galaxy system.

![GSOC Logo](https://developers.google.com/open-source/gsoc/images/gsoc2016-sun-373x373.png)