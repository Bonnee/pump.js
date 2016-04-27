#include <Arduino.h>
#include <Process.h>

Process nodejs;

#define ON        0
#define OFF       1

// Pressure sensor reading pin
#define SENSOR    A0

const int SAMPLES = 5;
int wait = 12000; //12000 for a minute
int index = 1;

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

const int STOREFREQ = 5; // The amount of reading cycles before sending the level through the bridge. 5 for every 5 minutes
int storeIndex = 1;

unsigned long p = 0;

void setup() {
        pinMode(13, OUTPUT); //Loading led
        digitalWrite(13, HIGH);

        for (int i = 0; i < sizeof(relay); i++) {
                pinMode(relay[i], OUTPUT);
                digitalWrite(relay[i], OFF);
        }

        Bridge.begin(); // Initialize the Bridge
        Serial.begin(9600); // Initialize the Serial
        while (!Serial);  // Wait for a serial connection (debug feature)

        printlog("Starting...");
        nodejs.runShellCommandAsynchronously("node /mnt/sda1/arduino/node/pump.js > /mnt/sda1/arduino/node/node_messages.log 2> /mnt/sda1/arduino/node/node_errors.log");
        printlog("Started process");

        digitalWrite(13, LOW);

        p = millis();
}

void loop() {
        unsigned long c = millis();
        if ((long)(c - p) >= 0) {
                p += wait;

                printlog("Reading partial level [" + String(index) + "/" + String(SAMPLES) + "]");
                reading[index - 1] = getLevel(true);

                if (index >= SAMPLES) {
                        liv = 0;
                        // avg calculation
                        for (int i = 0; i < SAMPLES; i++)
                                liv += reading[i];
                        liv = mapFloat(liv / SAMPLES, vMin, vMax, livMax, livMin);

                        if(storeIndex >= STOREFREQ) {
                                sendStatus("level","level",String(liv));
                                /*if (nodejs.running())
                                        nodejs.println(buildMsg("level", String(liv)));*/
                                storeIndex=1;
                        }
                        else
                                storeIndex++;
                        checkThresold();
                        index = 1;
                } else {
                        index++;
                }
        }

        while (nodejs.available())   // Read node output
                Serial.write(nodejs.read());
}

bool pump1, pump2, level, generic;
void checkThresold() {

        // relay 1
        if (liv <= 50) {
                digitalWrite(relay[0], ON);
                SendIfChanged(true, pump1,"state","pump1",String(true));
                pump1 = true;
        }
        else if (liv >= 70) {
                digitalWrite(relay[0], OFF);
                SendIfChanged(false, pump1,"state", "pump1", String(false));
                pump1 = false;
        }

        // relay 2
        if (liv <= 45) {
                digitalWrite(relay[1], ON);
                SendIfChanged(true, pump2, "state", "pump2", String(true));
                pump2 = true;
        }
        else if (liv >= 64) {
                digitalWrite(relay[1], OFF);
                SendIfChanged(false, pump2,"state", "pump2", String(false));
                pump2 = false;
        }

// alarm
        if (liv <= 10) {
                digitalWrite(relay[2], ON);
                SendIfChanged(true, level, "warning","level", String(true));
                level = true;
        }
        else if (liv >= 15) {
                digitalWrite(relay[2], OFF);
                SendIfChanged(false, level, "warning","level", String(false));
                level = false;
        }

        bool a = false;
        for (int i = 0; i < ALARMS; i++) {
                if (digitalRead(alarm[i]) == HIGH) {
                        a = true;
                }
                // Code to trigger the notification
        }
        if (a) {
                digitalWrite(13, HIGH);
                SendIfChanged(true, generic, "warning","generic",String(true));
                generic = true;
        }
        else {
                digitalWrite(13, LOW);
                SendIfChanged(false,generic,"warning","generic",String(false));
                generic = false;
        }
}

void SendIfChanged(bool current, bool before, String type,String caller, String value){
        if(isChanged(String(current), String(before))) sendStatus(type,caller,value);
}

bool isChanged(String current, String before){
        return !(current == before);
}

void sendStatus(String type, String caller, String value){
        if(nodejs.running()) {
                nodejs.println("{ \"type\":\"" + type + "\", \"caller\":\"" + caller + "\", \"value\":\"" + value + "\" }");
        }
}

String buildMsg(String id, String data){
        return "{ \"id\":\"" + id + "\", \"data\": " + data + " }";
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
