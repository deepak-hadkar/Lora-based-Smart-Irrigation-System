#include <Arduino.h>
#include <SPI.h>
#include <Wire.h>
#include <RadioLib.h>
#include <avr/wdt.h>
#include <avr/sleep.h>

// HS300x Sensor
#include <Arduino_HS300x.h>

bool readSensorStatus = false;
int soilMoisture = 0; // the moisture of soil
int batValue = 0;    // the voltage of battery
int datarateValue = 0; // Data rate of SX1278 in bps
int count = 0;
int ADC_O_1;           // ADC Output First 8 bits
int ADC_O_2;           // ADC Output Next 2 bits
int soilIndex = 0; // packet counter, we increment per xmission
float temperature, humidity = 0.0;
