// Water level pump driver

// The relay shield uses inverted values for the relays
#define ON        0
#define OFF       1
// Pressure sensor reading pin
#define SENSOR    A0

// Relays control pins
int relay[] =    { 3, 4, 5, 6 };
// Alarm input pins. When these pins input change, Arduino will trigger a relay.
int alarm[] = { 8,9 };

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

int t;

void setup() {
  for (int i = 0; i < sizeof(relay); i++) {
    pinMode(relay[i], OUTPUT);
    digitalWrite(relay[i], OFF);
  }

  Serial.begin(9600);
  Serial.println("[started]");
}

void loop() {
  reading[index] = getLevel(false);

  if (index == SAMPLES - 1) {
    liv = 0;

    // avg calculation
    for (int i = 0; i < SAMPLES -1; i++)
      liv += reading[i];
    liv = mapFloat(liv / SAMPLES, vMin, vMax, livMax, livMin);
    checkThresold();
    index = 0;
  } else {
    index++;
  }

  delay(100);
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

  bool a=false;
  for (int i = 0; i < ALARMS; i++) {
    if(digitalRead(alarm[i])==HIGH){
      a=true;
    }
    // Code to trigger the notification method in Linux
  }
  if(a)
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

