//#include <FileIO.h>

#define ON        0
#define OFF       1

// Pressure sensor reading pin
#define SENSOR    A0

const int SAMPLES = 5;
int wait = 10000 / SAMPLES;

// Relays control pins
int relay[] =    { 6, 5, 4, 3 };
// Alarm input pins. When these pins input change, Arduino will trigger a relay.
int alarm[] = { 8, 9 };


float reading[SAMPLES];

#define ALARMS (sizeof(alarm)/sizeof(int *))

// The maximum and minimum water level
float livMax =    108;
float livMin =    24;

// The maximum and minimum analog value (for mapping)
float vMin = 32.40;
float vMax = 633;

float liv;

int index = 1;

const int STOREFREQ = 30; // The amount of readings cycles before saving the value to SD.
int storeIndex = 1;

unsigned long p = 0;

void setup() {
  pinMode(13, OUTPUT); //Loading led
  digitalWrite(13, HIGH);

  for (int i = 0; i < sizeof(relay); i++) {
    pinMode(relay[i], OUTPUT);
    digitalWrite(relay[i], OFF);
  }

  //Serial.begin(9600);     // Serial log interface over USB
  /*printlog("Pump Control System v0.5");
  printlog("Initializing Bridge...");*/
  
  SERIAL_PORT_HARDWARE.begin(250000); // Replacement for the bridge
  
  do {
     while (SERIAL_PORT_HARDWARE.available() > 0) {
        SERIAL_PORT_HARDWARE.read();
        }
    
    delay(1000);
  } while (SERIAL_PORT_HARDWARE.available()>0);
  digitalWrite(13, LOW);

  p = millis();
}

void loop() {  
  SERIAL_PORT_HARDWARE.write('hello');
  unsigned long c = millis();
  if ((long)(c - p) >= 0) {
    p += wait;

    printlog("Reading partial level [" + String(index) + " of " + String(SAMPLES) + "]");
    reading[index - 1] = getLevel(true);

    if (index == SAMPLES) {
      liv = 0;
      // avg calculation
      for (int i = 0; i < SAMPLES; i++)
        liv += reading[i];
      liv = mapFloat(liv / SAMPLES, vMin, vMax, livMax, livMin);

      SERIAL_PORT_HARDWARE.println(liv);

      checkThresold();
      index = 1;
    } else {
      index++;
    }
  }
  delay(0);
}

void checkThresold() {
  // relay 1
  if (liv <= 50)
    digitalWrite(relay[0], ON);
  else if (liv >= 70)
    digitalWrite(relay[0], OFF);

  // relay 2
  if (liv <= 45)
    digitalWrite(relay[1], ON);
  else if (liv >= 64)
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

void printlog(String message) {
  if (Serial)
    Serial.println(message);
}
