// Written by Deepak Hadkar

#include "DTH_LoRa.h"

byte sIndex, sMoisture, sHumidity, sTemperature, sBattery, vIndex, vStatus, vBattery, sPercentage, vHighThres, vLowThres, vControl = 0;

SoilData soil;
BaseData base;
LoRaData lora;

byte soil_status = 0;  // received soil or not 0/1

unsigned long sleepCycle = 8000; // Initial sleep duration in milliseconds

void setup()
{
  Serial.begin(9600);
  delay(1000);
  Serial.print("Serial Initialise!");

#if SERIAL_ENABLE
  Serial.println("Valve start.");
  delay(100);
#endif

  allpinsLow();

  Lora_init();

  do_some_work();
}

void loop()
{
#if SERIAL_ENABLE
  Serial.println("<<Code start");
#endif

  do_some_work();

  // Check if valveStatus is off
  if (vStatus == 0)
  {
    enterDeepSleep(sleepCycle);
  }

#if SERIAL_ENABLE
  Serial.println("Code end>>");
#endif
}

void do_some_work()
{
  Lora_init();
  delay(50);

  // received_str = <ID:DTH1 [SOIL]: 0,0,880,89.17,33.28,97,0> ; message = soil;
  // received_str = <ID: DTH1 [BASE]: 0,1,70,30,0> ; message = base;
  while (true)
  {
    LoRaData lora = receive_lora();
    String loraMessage = lora.message;
    String loraString = lora.received_str;

    if (loraMessage == "soil" && soil_status == 0)
    {
      // Handle soil message
      soil = process_soil_message(loraString);

      sIndex = soil.soilIndex;
      sMoisture = soil.soilMoisture;
      sHumidity = soil.soilHumidity;
      sTemperature = soil.soilTemperature;
      sBattery = soil.soilBattery;
      sPercentage = soil.soilMoisture;

      soil_status = 1;
    }
    if (loraMessage == "base" && soil_status == 1)
    {
      // Handle base message
      base = process_base_message(loraString);

      vControl = base.valveControl;
      vHighThres = base.highThreshold;
      vLowThres = base.lowThreshold;

      vStatus = valveFunction(sPercentage, vHighThres, vLowThres, vControl); //IN1, IN2, PUMP_PIN, sPercentage, vHighThres, vLowThres, vControl, done_flag

      soil_status = 0;

      // send_lora(String send_id, byte m1, byte m2, byte m3, byte m4, byte m5, byte m6, byte m7, byte m8)
      send_lora(sIndex, sMoisture, sHumidity, sTemperature, sBattery, vIndex, vStatus, vBattery);
      delay(100);
      break;
    }
  }
}
