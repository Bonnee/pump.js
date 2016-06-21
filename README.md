#pump.js
## The problem
My house's basement is placed right over an acquifer that leads to problems of water infiltration. To control this phenomenon I decided to make a "smart" system that can give me a clear and easy view of the acquifer's state wherever I am. That's why I created pump.js

## The solution
pump.js consists in an Arduino Yún that, using a pressure sensor connected to a tube, measures the water level of an acquifer and, depending on the obtained value, triggers one or two drain pumps.

The system will communicate to ([Ohm sweet Ohm](https://github.com/SuperBonny/OsO.js.git)) that stores all the data and hosts a web control panel that permits to:

* Monitor the water level trough time using real time charts;
* Verify the functioning of the pumps and their stats.

In case of error (high water level, malfunctioning pump etc...) the system will fire an alarm to the central server that will handle the error.

### Some screenshots
#### Desktop
![alt text](/screenshots/desktop.jpg "The dashboard as seen on a desktop PC")
#### Mobile
![alt text](/screenshots/mobile.jpg "The dashboard as seen on a mobile device")
![alt text](/screenshots/mobile-stats.jpg "The pump stats screen as seen on a mobile device")

The main technologies involved are:

* Arduino "Wiring" language;
* Node.js;
* Socket.io;
* jQuery;
* Dygraphs.

[School essay link](http://tesine.marconirovereto.it/dettagli.html?2016.5BI.3)
