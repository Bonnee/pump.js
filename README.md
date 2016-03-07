The sytem consists in an Arduino Yún that, using a pressure sensor, measures the water level of an acquifer and, depending on the obtained value, tiggers one or two drain pumps.

The management of the system is guaranteed by a web control panel running on the Arduino itself that permits to:

* Monitor the water level trough time using real time charts;
* Verify the functioning of the pumps and their active time;
* Set the threshold at wich the pump's state will be changed.

In case of error (high acquifer level, malfuncioning pump etc...) the system will send an E-mail to a specified address and will also trigger an alarm audible from the apartment.

The system will use many different technologes like:

* HTML5 - CSS3 - JavaScript
* Node.js
* REST Services
* Web Sockets
