/*
  SD card datalogger

  This example shows how to log data from three analog sensors
  to an SD card mounted on the Arduino Yún using the Bridge library.

  The circuit:
   analog sensors on analog pins 0, 1 and 2
   SD card attached to SD card slot of the Arduino Yún

  Prepare your SD card creating an empty folder in the SD root
  named "arduino". This will ensure that the Yún will create a link
  to the SD to the "/mnt/sd" path.

  You can remove the SD card while the Linux and the
  sketch are running but be careful not to remove it while
  the system is writing to it.

  created  24 Nov 2010
  modified 9 Apr 2012
  by Tom Igoe
  adapted to the Yún Bridge library 20 Jun 2013
  by Federico Vanzati
  modified  21 Jun 2013
  by Tom Igoe

  This example code is in the public domain.

  http://www.arduino.cc/en/Tutorial/YunDatalogger

*/

#include <FileIO.h>

#define ON        0
#define OFF       1
// Pressure sensor reading pin
#define SENSOR    A0

// Relays control pins
int relay[] =    { 3, 4, 5, 6 };
// Alarm input pins. When these pins input change, Arduino will trigger a relay.
int alarm[] = { 8, 9 };

#define SAMPLES 5
float reading[SAMPLES];

#define ALARMS (sizeof(alarm)/sizeof(int *))

// The maximum and minimum water level
float livMax =    30;
float livMin =    0;

// The maximum and minimum analog value (for mapping)
float vMin = 30;
float vMax = 250;

float liv;

int index = 0;

unsigned long p = 0;
int wait = 12000;

char *path = "/mnt/sda1/log.csv";

void setup() {
  for (int i = 0; i < sizeof(relay); i++) {
    pinMode(relay[i], OUTPUT);
    digitalWrite(relay[i], OFF);
  }
  
  Bridge.begin();
  Serial.begin(9600);
  FileSystem.begin();

  if (Serial)
    Serial.println("Filesystem datalogger\n");

  p = millis();
}

void checkThresold() {
  // relay 1
  if (liv <= 10)
    digitalWrite(relay[0], ON);
  else if (liv >= 25)
    digitalWrite(relay[0], OFF);

  // relay 2
  if (liv <= 18)
    digitalWrite(relay[1], ON);
  else if (liv >= 25)
    digitalWrite(relay[1], OFF);

  // alarm
  if (liv <= 5)
    digitalWrite(relay[2], ON);
  else if (liv >= 7)
    digitalWrite(relay[2], OFF);

  bool a = false;
  for (int i = 0; i < ALARMS; i++) {
    if (digitalRead(alarm[i]) == HIGH) {
      a = true;
    }
    // Code to trigger the notification method in Linux using the Arduino bridge
  }
  if (a)
    digitalWrite(13, HIGH);
  else
    digitalWrite(13, LOW);
}

float getLevel(bool raw) {
  if (raw)
    return analogRead(SENSOR);
  else
    return mapFloat(analogRead(SENSOR), vMin, vMax, livMax, livMin);
}

float mapFloat(float x, float in_min, float in_max, float out_min, float out_max)
{
  return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

void loop() {
  // make a string that start with a timestamp for assembling the data to log:


  unsigned long c = millis();
  if ((long)(c - p) >= 0) {
    p += wait;

    reading[index] = getLevel(true);

    if (index == SAMPLES) {
      liv = 0;
      // avg calculation
      for (int i = 0; i < SAMPLES; i++)
        liv += reading[i];
      liv = mapFloat(liv / SAMPLES, vMin, vMax, livMax, livMin);



      String dataString = "";
      dataString = getTimeStamp();
      Serial.println(dataString);

      File dataFile = FileSystem.open(path, FILE_APPEND);

      if (dataFile) {
        dataFile.println(getTimeStamp() + "," + String(liv));
        dataFile.close();
      }
      // if the file isn't open, pop up an error:
      else {
        Serial.println("error opening datalog.txt");
      }



      checkThresold();
      index = 0;
    } else {
      index++;
    }
  }
  delay(0);
}

// This function return a string with the time stamp
String getTimeStamp() {
  String result;
  Process time;
  // date is a command line utility to get the date and the time
  // in different formats depending on the additional parameter
  time.begin("date");
  time.addParameter("+%D-%T");  // parameters: D for the complete date mm/dd/yy
  //             T for the time hh:mm:ss
  time.run();  // run the command

  // read the output of the command
  while (time.available() > 0) {
    char c = time.read();
    if (c != '\n') {
      result += c;
    }
  }

  return result;
}
