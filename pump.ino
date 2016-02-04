// Water level pump driver
#include <FileIO.h>
/*
class Logger {
    char *path;

  public:
    Logger(char *p) {
      FileSystem.begin();
      path = p;
    }

    void Append(String data) {
      File dataFile = FileSystem.open(path, FILE_APPEND);

      String d = getTimeStamp() + "," + data;
      if (dataFile) {
        dataFile.println(d);
        dataFile.close();
        if (Serial)
          Serial.println(d);
      } else if (Serial)
        Serial.println("Storage unavailable.");
    }
  private:
    String getTimeStamp() {
      String result;
      Process time;
      time.begin("date");
      time.addParameter("+%D-%T");  // mm/dd/yy-hh:mm:ss
      time.run();

      while (time.available() > 0) {
        char c = time.read();
        if (c != '\n') {
          result += c;
        }
      }

      return result;
    }
};*/


// The relay shield uses inverted values for the relays
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
int wait = 400;

//Logger *data;

void setup() {
  for (int i = 0; i < sizeof(relay); i++) {
    pinMode(relay[i], OUTPUT);
    digitalWrite(relay[i], OFF);
  }

  Bridge.begin();
  Serial.begin(9600);

  //data = new Logger("/mnt/sda1/log.csv");

  if (Serial)
    Serial.println("[started]");
  p = millis();
}

void loop() {
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

      Serial.println(String(liv));
      //data->Append(String(liv));

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

