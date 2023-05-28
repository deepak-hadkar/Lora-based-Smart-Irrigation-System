// Written by Deepak Hadkar, last modified 03 Oct. 2022, 12:30 am

#include "customs.h"
#include "defines.h"

String send_id = String("ID:") + "DTH1 [BASE]: "; // ID:DHT1 [BASE]:

void Lora_init()
{
  int state = radio.begin(FREQUENCY, BANDWIDTH, SPREADING_FACTOR, CODING_RATE, SX127X_SYNC_WORD, OUTPUT_POWER, PREAMBLE_LEN, GAIN);

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

void setup()
{
  Serial.begin(9600);
  delay(1000);
  Serial.println("Serial Initialise!");
  Serial.println(getResetReason());

#if SERIAL_ENABLE
  Serial.println("Valve start.");
  delay(100);
#endif

  pinMode(LORA_RST, OUTPUT);
  digitalWrite(LORA_RST, HIGH);
  delay(100);

  Lora_init();

  do_some_work();
}

void loop()
{
#if SERIAL_ENABLE
  Serial.println("<<Code start");
#endif

  do_some_work();

#if SERIAL_ENABLE
  Serial.println("Code end>>");
#endif
}

void do_some_work()
{
  digitalWrite(LORA_RST, HIGH);
  delay(5);

  Lora_init();
  delay(50);

  receive_lora();

  receiveESP8266();

  send_lora();

  delay(100);
}

void send_lora()
{
  String loraMessage = send_id + "0," + (String)valveControl + ',' + (String)highThreshold + ',' + (String)lowThreshold + ",0";

  String back_str = "<" + loraMessage + ">";

#if SERIAL_ENABLE
  Serial.println();
  Serial.println(back_str);
#endif
  radio.transmit(back_str); //<ID:DTH1 [BASE]: 0,1,75,30,0>
  delay(100);
}

void receive_lora()
{
  String received_str;
  int state = radio.receive(received_str); //<ID:DTH1 [VALVE]: 0,1,855,81.91,30.62,1,88,1,0,98,0>

  if (state == RADIOLIB_ERR_NONE)
  {
    // packet was successfully received
#if SERIAL_ENABLE
    Serial.println(F("Success!"));
#endif
    lora_receive = true;

#if SERIAL_ENABLE
    Serial.print(F("[SX1278] Data: "));
    Serial.println(received_str);

    Serial.print(F("[SX1278] Datarate: "));
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

    // String received_str = <ID:DTH1 [VALVE]: 0,1,855,81.91,30.62,1,88,1,0,98,0>
    process_message(received_str);
  }

#if SERIAL_ENABLE
  else
  {
    // some other error occurred
    Serial.print(F("failed, code "));
    Serial.println(state);
  }
#endif
}

void receiveESP8266()
{
  //  String loraMessage = "<ID:DTH001 [LoRa]: 0,1,5,81.91,30.62,1,88,1,0,98,0>";

  while (Serial.available() > 0 || !done)
  {
    char incoming_char = Serial.read();
    // Check if start character is received
    if (incoming_char == '<')
    {
      received_message = "";
    }

    received_message += incoming_char;

    if (incoming_char == '>')
    {
      process_message(received_message);
      done = true;
    }
  }
}

void process_message(String message)
{
  message = message.substring(1, message.length() - 1); // Remove start and end characters
  if (message.startsWith("ID:DTH1 [VALVE]: "))
  {                        // check if the message is valid
    message.remove(0, 17); // remove the ID and protocol information from the message

#if SERIAL_ENABLE
    Serial.println("Received data: " + message);
#endif
    pos = 0;       // reset the number of extracted values to zero
    lastIndex = 0; // initialize the index of the last comma to zero

    for (int i = 0; i < message.length() && pos < MAX_VALUES; i++)
    { // loop through the string
      if (message.charAt(i) == ',')
      {                                                                   // if a comma is found
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
    soilStatus = extractedValues[5];
    soilBattery = extractedValues[6];
    valveIndex = extractedValues[7];
    valveStatus = extractedValues[8];
    valveBattery = extractedValues[9];
    delay(100);
  }
  else if (message.startsWith("ID:DTH1 [WIFI]: "))
  {                        // check if the message is valid
    message.remove(0, 16); // remove the ID and protocol information from the message

#if SERIAL_ENABLE
    Serial.println("Received data: " + message);
#endif
    pos = 0;       // reset the number of extracted values to zero
    lastIndex = 0; // initialize the index of the last comma to zero

    for (int i = 0; i < message.length() && pos < MAX_VALUES; i++)
    { // loop through the string
      if (message.charAt(i) == ',')
      {                                                                   // if a comma is found
        extractedValues[pos++] = message.substring(lastIndex, i).toInt(); // extract the value and convert it to integer
        lastIndex = i + 1;                                                // set the index of the last comma to the next character after the comma
      }
    }
    extractedValues[pos++] = message.substring(lastIndex).toInt(); // extract the last value and convert it to integer

    //  garbage = extractedValues[0];
    valveControl = extractedValues[1];
    highThreshold = extractedValues[2];
    lowThreshold = extractedValues[3];
    delay(100);
  }

  else
  {
    // Do Nothing
  }
}
