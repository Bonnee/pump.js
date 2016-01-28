// Water level pump driver
#include <FileIO.h>

class Logger {
    char *path;

  public:
    Logger(char *p) {
      path = p;
      FileSystem.begin();
    }

    void Append(String data) {
      File dataFile = FileSystem.open(path, FILE_APPEND);
      String d = getTimeStamp() + "," + data;
      if (Serial)
        Serial.println(d);
      dataFile.println(d);

      dataFile.close();
    }
  private:
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
};


// The relay shield uses inverted values for the relays
#define ON        0
#define OFF       1
// Pressure sensor reading pin
#define SENSOR    A0

// Relays control pins
int relay[] =    { 3, 4, 5, 6 };
// Alarm input pins. When these pins input change, Arduino will trigger a relay.
int alarm[] = { 8, 9 };

#define SAMPLES (sizeof(relay)/sizeof(float *))
#define ALARMS (sizeof(alarm)/sizeof(int *))

// The maximum and minimum water level
float livMax =    30;
float livMin =    0;

//The maximum and minimum analog value (for mapping)
float vMin = 29.5;
float vMax = 237;

float liv;

float reading[5];
#define READINGS (sizeof(reading)/sizeof(float *))

int index = 0;

unsigned long p = 0;
int wait = 12000;

Logger *data;

void setup() {
  for (int i = 0; i < sizeof(relay); i++) {
    pinMode(relay[i], OUTPUT);
    digitalWrite(relay[i], OFF);
  }

  data = new Logger("/mnt/sda1/log.txt");
  Bridge.begin();
  Serial.begin(9600);
  if (Serial)
    Serial.println("[started]");
  p = millis();
}

void loop() {
  unsigned long c = millis();
  if ((long)(c - p) >= 0) {
    p += wait;

    if (Serial)
      Serial.println(index);
    reading[index] = getLevel(false);
    if (index == SAMPLES) {
      liv = 0;

      // avg calculation
      for (int i = 0; i < SAMPLES - 1; i++)
        liv += reading[i];
      liv = mapFloat(liv / SAMPLES, vMin, vMax, livMax, livMin);
      data->Append(String(liv));
      checkThresold();
      index = 0;
    } else {
      index++;
    }
  }
  delay(0);
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
    // Code to trigger the notification method in Linux
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

