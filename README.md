#pump.js
## The problem
My house's basement is placed right over an acquifer that leads to problems of water infiltration. To control this phenomenon I decided to make a "smart" system that can give me a clear and easy view of the acquifer's state wherever I am. That's why I created pump.js

## The solution
pump.js consists in an Arduino Yún that, using a pressure sensor connected to a tube, measures the water level of an acquifer and, depending on the obtained value, triggers one or two drain pumps.

The system will communicate to a self made server ([Ohm sweet Ohm](https://github.com/SuperBonny/OsO.js.git)) that stores all the data and hosts a web control panel that permits to:

* Monitor the water level trough time using real time charts;
* Verify the functioning of the pumps and their active time;
* Set the thresholds at which the pumps will be triggered.

In case of error (high water level, malfunctioning pump etc...) the system will fire an alarm to the central server that will handle the error.


The main technologies I used are:

* Arduino "Wiring" language;
* Node.js;
* Web Sockets.

[School essay link](http://tesine.marconirovereto.it/dettagli.html?2016.5BI.3)
