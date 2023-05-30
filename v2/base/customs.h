#include <RadioLib.h>
#include <avr/wdt.h>
#include <avr/sleep.h>

bool lora_receive = true;

int datarateValue = 0; // Data rate of SX1278 in bps
int done_flag = 0;
int count = 0;
int ADC_O_1; // ADC Output First 8 bits
int ADC_O_2; // ADC Output Next 2 bits

int dry_value = 880;
int wet_value = 500;
int moisture = 0;

// Send-Receive LoRa strings
int soilIndex, soilMoisture, soilBattery, valveIndex, valveStatus, valveBattery, valve_status, valveControl, highThreshold, lowThreshold = 0;
float soilHumidity, soilTemperature;

const int MAX_VALUES = 10;       // set the maximum number of values to extract
int extractedValues[MAX_VALUES]; // create an array to store the extracted values
uint8_t pos = 0;                 // initialize the position to zero
uint8_t lastIndex = 0;           // initialize the index of the last comma to zero

bool message_started = false;
String received_message = ""; //<ID:DTH1 [WIFI]: 0,1,5,81.91,30.62,88,1,0,98,0>
