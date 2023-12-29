#include <RadioLib.h>
#include "DTH_LoRa.h"
#include "customs.h"
#include "defines.h"

SX1278 radio = new Module(LORA_CS, DIO0, LORA_RST, DIO1);

void process_soil_message(String message)
{
  message = message.substring(16, message.length() - 1); // Remove ID and end character
  if (message.startsWith("ID:DTH1 [SOIL]: "))
  { // check if the message is valid
    message.remove(0, 16); // remove the ID and protocol information from the message

#if SERIAL_ENABLE
    Serial.println("Received data: " + message);
#endif
    pos = 0;       // reset the number of extracted values to zero
    lastIndex = 0; // initialize the index of the last comma to zero

    for (int i = 0; i < message.length() && pos < MAX_VALUES; i++)
    { // loop through the string
      if (message.charAt(i) == ',')
      { // if a comma is found
        extractedValues[pos++] = message.substring(lastIndex, i).toInt(); // extract the value and convert it to integer
        lastIndex = i + 1;                                                // set the index of the last comma to the next character after the comma
      }
    }
    extractedValues[pos++] = message.substring(lastIndex).toInt(); // extract the last value and convert it to integer

    //  garbage = extractedValues[0];
    soilIndex = extractedValues[1];
    soilMoisture = extractedValues[2];
    soilHumidity = extractedValues[3];
    soilTemperature = extractedValues[4];
    soilBattery = extractedValues[5];
    delay(100);

    moisture = map(soilMoisture, dry_value, wet_value, 0, 100);
    delay(50);
  }
}

void process_base_message(String message)
{
  message = message.substring(16, message.length() - 1); // Remove ID and end character
  if (message.startsWith("ID:DTH1 [BASE]: "))
  { // check if the message is valid
    message.remove(0, 16); // remove the ID and protocol information from the message

#if SERIAL_ENABLE
    Serial.println("Received data: " + message);
#endif
    pos = 0;       // reset the number of extracted values to zero
    lastIndex = 0; // initialize the index of the last comma to zero

    for (int i = 0; i < message.length() && pos < MAX_VALUES; i++)
    { // loop through the string
      if (message.charAt(i) == ',')
      { // if a comma is found
        extractedValues[pos++] = message.substring(lastIndex, i).toInt(); // extract the value and convert it to integer
        lastIndex = i + 1;                                                // set the index of the last comma to the next character after the comma
      }
    }
    extractedValues[pos++] = message.substring(lastIndex).toInt(); // extract the last value and convert it to integer

    //  garbage = extractedValues[0];
    valveControl = extractedValues[1];
    highThreshold = extractedValues[2];
    lowThreshold = extractedValues[3];
    delay(50);
  }
}

void valveFunction()
{
  if ((moisture <= 30 || valveControl == 1) && done_flag == 0) // "Relay-Pump && Valve On"
  {
    Valve_on();
    digitalWrite(IN1, LOW);
    digitalWrite(IN2, LOW);
    delay(3000);

    digitalWrite(PUMP_PIN, HIGH); // Relay-Pump on

    done_flag = 1;
  }
  if (moisture >= 70 && done_flag == 1) // "Relay-Pump && Valve Off"
  {
    digitalWrite(PUMP_PIN, LOW); // Relay-Pump Off
    delay(1000);
    Valve_off();
    digitalWrite(IN1, LOW);
    digitalWrite(IN2, LOW);
    delay(3000);

    done_flag = 0;
  }
}

void send_lora()
{
  String loraMessage = send_id + "0," + (String)soilIndex + ',' + (String)moisture + ',' + (String)soilHumidity + ',' + (String)soilTemperature + ',' + (String)soilBattery + ',' + (String)valveIndex + ',' + (String)valveStatus + ',' + (String)valveBattery + ",0";

  String back_str = "<" + loraMessage + ">";

#if SERIAL_ENABLE
  Serial.println();
  Serial.println(back_str);
#endif
  radio.transmit(back_str); //<ID:DTH1 [VALVE]: 0,1,855,81.91,30.62,1,88,1,0,98,0>
  valveIndex++;
  delay(100);
}

void receive_lora()
{
  String received_str;
  int state;

  while (true)
  {
    state = radio.receive(received_str); // Receive LoRa message

    if (state == RADIOLIB_ERR_NONE)
    {
      // Packet was successfully received
#if SERIAL_ENABLE
      Serial.println(F("Success!"));
#endif

#if SERIAL_ENABLE
      Serial.print(F("[SX1278] Data: "));
      Serial.println(received_str);
#endif

      if (received_str.startsWith("ID:DTH1 [SOIL]:"))
      {
        // Handle soil message
        process_soil_message(received_str);
        break; // Exit the while loop after processing the soil message
      }
      else if (received_str.startsWith("ID:DTH1 [BASE]:"))
      {
        // Handle base message
        process_base_message(received_str);
        break; // Exit the while loop after processing the base message
      }
      else
      {
        // Invalid message format
#if SERIAL_ENABLE
        Serial.println(F("Invalid message format!"));
#endif
      }
    }
    else if (state == RADIOLIB_ERR_RX_TIMEOUT)
    {
      // Timeout occurred while waiting for a packet
#if SERIAL_ENABLE
      Serial.println(F("Timeout!"));
#endif
    }
    else if (state == RADIOLIB_ERR_CRC_MISMATCH)
    {
      // Packet was received, but is malformed
#if SERIAL_ENABLE
      Serial.println(F("CRC error!"));
#endif
    }
    else
    {
      // Some other error occurred
#if SERIAL_ENABLE
      Serial.print(F("Failed, code "));
      Serial.println(state);
#endif
    }
  }
}

void Valve_on()
{
  Serial.println(F("PUMP ON == Valve ON!"));
  valveStatus = 1;
  digitalWrite(IN1, HIGH);
  digitalWrite(IN2, LOW);
  delay(100);
}
void Valve_off()
{
  Serial.println(F("PUMP OFF == Valve OFF!"));
  valveStatus = 0;
  digitalWrite(IN1, LOW);
  digitalWrite(IN2, HIGH);
  delay(100);
}

void Lora_init()
{
  digitalWrite(LORA_RST, HIGH);
  delay(100);

  int state = radio.begin(FREQUENCY, BANDWIDTH, SPREADING_FACTOR, CODING_RATE, SX127X_SYNC_WORD, OUTPUT_POWER, PREAMBLE_LEN, GAIN);
  delay(1000);

  if (state == RADIOLIB_ERR_NONE)
  {
    datarateValue = radio.getDataRate(); // Data rate in bps
#if SERIAL_ENABLE
    Serial.println(F("Success!"));
    Serial.print(F("[SX1278] Datarate:\t"));
    Serial.print(radio.getDataRate());
    Serial.println(F(" bps"));

    Serial.print(F("[SX1278] RSSI: ")); // print the RSSI (Received Signal Strength Indicator)
    Serial.print(radio.getRSSI());
    Serial.println(F(" dBm"));

    Serial.print(F("[SX1278] SNR: "));
    Serial.print(radio.getSNR());
    Serial.println(F(" dB"));

    Serial.print(F("[SX1278] Frequency error: "));
    Serial.print(radio.getFrequencyError());
    Serial.println(F(" Hz"));
#endif
  }
  else
  {
#if SERIAL_ENABLE
    Serial.print(F("Failed, code "));
    Serial.println(state);
#endif
  }
}

void allpinsLow()
{
  pinMode(IN1, OUTPUT);
  pinMode(IN2, OUTPUT);
  pinMode(PUMP_PIN, OUTPUT);
  pinMode(LORA_RST, OUTPUT);

  digitalWrite(IN1, LOW);
  digitalWrite(IN2, LOW);
  digitalWrite(PUMP_PIN, LOW);
}
