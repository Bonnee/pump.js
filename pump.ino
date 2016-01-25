// Water level pump driver

// The relay shield uses inverted values for the relays
#define ON        0
#define OFF       1
// Pressure sensor reading pin
#define SENSOR    A0

// Relays control pin
int relay[4] =    { 3, 4, 5, 6 };

// The maximum and minimum water level
float livMax =    30;
float livMin =    0;

//The maximum and minimum analog value (for mapping)
float vMin = 29.5;
float vMax = 237;

float liv;
float reading[5];
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
  reading[index] = getLevel(true);

  if (index >= 5) {
    liv = 0;

    // avg calculation
    for (int i = 0; i < 5; i++)
      liv += reading[i];
    liv = mapFloat(liv / 5, vMin, vMax, livMax, livMin);
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

