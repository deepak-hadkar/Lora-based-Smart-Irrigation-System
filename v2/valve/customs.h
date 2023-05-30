#include <RadioLib.h>
#include <avr/wdt.h>
#include <avr/sleep.h>

bool lora_receive1 = true;
bool lora_receive2 = true;
//bool sleepMode = false;

int datarateValue = 0; // Data rate of SX1278 in bps
int done_flag = 0;
int count = 0;
int ADC_O_1; // ADC Output First 8 bits
int ADC_O_2; // ADC Output Next 2 bits

int dry_value = 880;
int wet_value = 470;
int moisture = 0;

// Send-Receive LoRa strings
int soilIndex, soilMoisture, soilStatus, soilBattery, valveIndex, valveStatus, valveBattery, valve_status, valveControl = 0;
int highThreshold = 70;
int lowThreshold = 30;
float soilHumidity, soilTemperature;

const int MAX_VALUES = 10;       // set the maximum number of values to extract
int extractedValues[MAX_VALUES]; // create an array to store the extracted values
uint8_t pos = 0;                 // initialize the position to zero
uint8_t lastIndex = 0;           // initialize the index of the last comma to zero
