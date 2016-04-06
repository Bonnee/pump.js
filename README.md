#pump.js
pump.js consists in an Arduino Yún that, using a pressure sensor, measures the water level of an acquifer and, depending on the obtained value, triggers one or two drain pumps.

The system will communicate through WebSockets to an [Ohm sweet Ohm](https://github.com/SuperBonny/OsO.js.git) server that stores all the data and hosts a web control panel that permits to:

* Monitor the water level trough time using real time charts;
* Verify the functioning of the pumps and their active time;
* Set the threshold at which the pump's state will be changed.

In case of error (high water level, malfunctioning pump etc...) the system will send an E-mail to a specified address and will also trigger an audible alarm.

The system uses many different technologies like:

* Node.js
* The Firmata protocol
* Web Sockets

[School essay link](http://tesine.marconirovereto.it/dettagli.html?2016.5BI.3)
