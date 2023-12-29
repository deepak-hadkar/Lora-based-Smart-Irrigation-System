#ifndef DTH_LORA_H
#define DTH_LORA_H

#include <Arduino.h> // Include Arduino.h for String type
#include <avr/sleep.h>
#include <avr/wdt.h>

extern void Lora_init();
extern void send_lora(byte m1, byte m2, byte m3, byte m4, byte m5, byte m6, byte m7, byte m8);

extern void Valve_on();
extern void Valve_off();
extern byte valveFunction(byte moisture, byte highThreshold, byte lowThreshold, byte valveControl);
extern void allpinsLow();

struct SoilData
{
  byte soilIndex;
  byte soilMoisture;
  byte soilHumidity;
  byte soilTemperature;
  byte soilBattery;
  byte soilPercentage;
};
struct BaseData
{
  byte valveControl;
  byte highThreshold;
  byte lowThreshold;
};

struct LoRaData
{
  String message;
  String received_str;
};

extern SoilData process_soil_message(String message);
extern BaseData process_base_message(String message);
extern LoRaData receive_lora();

extern void enterDeepSleep(unsigned long duration);

#endif
