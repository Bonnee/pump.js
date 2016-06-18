#include <Arduino.h>
#include <Process.h>

Process nodejs;

// Relay shield has inverted states
#define ON        1
#define OFF       0

// Pressure sensor reading pin
#define SENSOR    A0

const int SAMPLES = 1;  // Number of samples to take
int wait = 100; // Milliseconds to wait between samples

int index = 0;  // Samples count

// Relays control pins
int relay[] = { 6, 5, 4, 3 };

// Alarm input pins. When these pins input change, Arduino will trigger a relay.
int alarm[] = { 8, 9 };

float reading[SAMPLES];

#define ALARMS (sizeof(alarm) / sizeof(int *))

// The maximum and minimum water level (in cm)
float livMax =    70;
float livMin =    30;

// The maximum and minimum analog reading (for mapping)
float vMin = 0;
float vMax = 1023;

float liv = 0;  // The level

int flag = 1; // To interchange pumps.

const int STOREFREQ = 0;  // The amount of reading cycles before sending the level through the bridge. 5 for every 5 minutes
int storeIndex = 1;

unsigned long prev;   // Time counting var

void setup() {
        pinMode(13, OUTPUT); // Triggers loading led
        digitalWrite(13, HIGH);

        for (int i = 0; i < sizeof(relay); i++) {
                pinMode(relay[i], OUTPUT);
                digitalWrite(relay[i], OFF);
        }

        Bridge.begin(); // Initialize the Bridge
        Serial.begin(115200); // Initialize the Serial

        //while (!Serial) ; // Wait for a serial connection (debug only)

        printlog("Starting...");

        String path = "/mnt/sda1/arduino/backend";
        Process tmp;
        tmp.begin("echo hello linux");  // To fix invalid characters at the beginning of the stream
        tmp.run();
        nodejs.runShellCommandAsynchronously("node /mnt/sda1/arduino/backend/pump.js > /mnt/sda1/arduino/backend/node_messages.log 2> /mnt/sda1/arduino/backend/node_errors.log");
        //nodejs.runShellCommandAsynchronously("node " + path + "/pump.js > " + path + "/node_messages.log 2 > " + path + "/node_errors.log");
        printlog("Started process");

        digitalWrite(13, LOW);  // All's done. Let's turn it off

        prev = millis();
}

void loop() {
        // Explaination: http://playground.arduino.cc/Code/TimingRollover
        unsigned long cur = millis();
        if (cur - prev >= wait) {
                prev = cur;

                printlog("Reading partial level [" + String(index + 1) + "/" + String(SAMPLES) + "]");
                reading[index] = getLevel(true);
                //sendStatus("log", "level", String(mapFloat(reading[index], vMin, vMax, livMax, livMin))); // --TEST--

                if (index + 1 >= SAMPLES) {
                        liv = 0;
                        // avg calculation
                        for (int i = 0; i < SAMPLES; i++)
                                liv += reading[i];
                        liv = mapFloat(liv / SAMPLES, vMin, vMax, livMax, livMin);
                        printlog(String(liv));
                        printlog("Store index [" + String(storeIndex) + "/" + String(STOREFREQ) + "]");

                        if(storeIndex >= STOREFREQ) {

                                sendStatus("log", "level", String(liv));
                                storeIndex = 1;
                        }
                        else{
                                storeIndex++;
                        }

                        checkThresold();
                        index = 0;
                } else {
                        index++;
                }

                while (nodejs.available())           // Read node output
                        Serial.write(nodejs.read());
        }
}

bool pump[]={false, false}; bool level=false; bool generic=false;

void checkThresold() {

        if(liv <= 45 && !pump[flag]) {
                digitalWrite(relay[flag], ON);
                sendStatus("log", "pump" + String(flag + 1), String(true));
                pump[flag] = true;
        }

        if(liv >= 65) {                                      // Lower threshold
                if(pump[0]) {                                     // First Pump
                        digitalWrite(relay[0], OFF);
                        sendStatus("log", "pump1", String(false));
                        pump[0] = false;
                        if(flag == 0)
                                flag = 1;
                }
                if(pump[1]) {                                     // Second Pump
                        digitalWrite(relay[1], OFF);
                        sendStatus("log", "pump2", String(false));
                        pump[1] = false;
                        if(flag == 1)
                                flag = 0;
                }
        }

        if(liv >= 66) { // Security measure
                digitalWrite(relay[0], OFF);
                digitalWrite(relay[1], OFF);
                pump[0] = false;
                pump[1] = false;
        }

        if(liv <= 40 && (!pump[0] || !pump[1])) {
                digitalWrite(relay[0], ON);
                digitalWrite(relay[1], ON);
                digitalWrite(13,HIGH);
                if(!pump[0])
                        sendStatus("log", "pump1", String(true));
                if(!pump[1])
                        sendStatus("log", "pump2", String(true));
                pump[0] = true;
                pump[1] = true;
                
        } else
        if(liv>=40){
          digitalWrite(13,LOW);
        }

// alarm
        /*if (liv <= 30 && !level) {
                sendStatus("warning", "level", String(true));
                level = true;
           }
           else if (liv >= 35 && level) {
                sendStatus("warning", "level", String(false));
                level = false;
           }

           bool a = false;
           for (int i = 0; i < ALARMS || a; i++) {
                if (digitalRead(alarm[i]) == HIGH)
                        a = true;
           }

           if (a && !generic) {
                digitalWrite(13, HIGH);
                sendStatus("warning", "generic", String(true));
                generic = true;
           }
           else if(!a && generic) {
                digitalWrite(13, LOW);
                sendStatus("warning", "generic", String(false));
                generic = false;
           }*/
}

void sendStatus(String type, String caller, String value){
        if(nodejs.running()) {
                String msg;
                if(caller == "pump1" || caller == "pump2")
                        msg="{ \"type\":\"" + type + "\", \"caller\":\"" + caller + "\", \"value\": [\"" + value + "\", \"" + String(liv) + "\"] }";
                else
                        msg="{ \"type\":\"" + type + "\", \"caller\":\"" + caller + "\", \"value\":\"" + value + "\" }";
                nodejs.println(msg);
        }
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
