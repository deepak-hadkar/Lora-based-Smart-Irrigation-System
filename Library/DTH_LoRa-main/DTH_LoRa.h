#ifndef DTH_LORA_H
#define DTH_LORA_H

#include <Arduino.h> // Include Arduino.h for String type

extern void process_soil_message(String message);
extern void process_base_message(String message);


extern void Lora_init();
extern void send_lora();
extern void receive_lora();

extern void Valve_on();
extern void Valve_off();
extern void valveFunction();
extern void allpinsLow();

#endif
