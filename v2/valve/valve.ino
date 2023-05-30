// Written by Deepak Hadkar, last modified 03 Oct. 2022, 12:30 am

#include "customs.h"
#include "defines.h"

//String wifi_id = String("ID:") + "DTH1 [LoRa]: ";  // ID:DHT1 [LORA]:
String send_id = String("ID:") + "DTH1 [VALVE]: "; // ID:DHT1 [VALVE]:

void Lora_init()
{
  // SX1278::begin(434.0, 125.0, 9, 7, SX127X_SYNC_WORD, 10, 8, 0);
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

void setup()
{
  Serial.begin(9600);
  delay(1000);
  Serial.print("Serial Initialise!");
  Serial.println(getResetReason());

#if SERIAL_ENABLE
  Serial.println("Valve start.");
  delay(100);
#endif

  pinMode(IN1, OUTPUT);
  pinMode(IN2, OUTPUT);
  pinMode(PUMP_PIN, OUTPUT);

  digitalWrite(IN1, LOW);
  digitalWrite(IN2, LOW);
  digitalWrite(PUMP_PIN, LOW);
  delay(100);

  pinMode(LORA_RST, OUTPUT);
  digitalWrite(LORA_RST, HIGH);
  delay(100);

  Lora_init();

  do_some_work();

  //#if SERIAL_ENABLE
  //  Serial.println("[Set]Sleep Mode Set");
  //#endif
  //
  //  if (sleepMode)
  //  {
  //    low_power_set();
  //    sleepMode = false;
  //  }
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

void loop()
{
  //  wdt_disable();
  //
  //  if (count > SLEEP_CYCLE) //(7+1) x 8S  450
  //  {

#if SERIAL_ENABLE
  Serial.println("<<Code start");
#endif

  do_some_work();

#if SERIAL_ENABLE
  Serial.println("Code end>>");
#endif
  //  count = 0; // count init
  //}

  //  if (sleepMode)
  //  {
  //    low_power_set();
  //    sleepMode = false;
  //  }
}

void do_some_work()
{
  digitalWrite(LORA_RST, HIGH);
  delay(5);

  Lora_init();
  delay(50);

  while (lora_receive1)
  {
    receive_lora();
  }

  delay(1000);
  send_lora(); // To Base-Station

  while (lora_receive2)
  {
    receive_lora();
  }

  //  Serial.print(lowThreshold); Serial.println(highThreshold);
  if ((moisture <= 30 || valveControl == 1) && done_flag == 0) // "Relay-Pump && Valve On"
  {
    Valve_on();
    digitalWrite(IN1, LOW);
    digitalWrite(IN2, LOW);
    delay(3000);

    digitalWrite(PUMP_PIN, HIGH); // Relay-Pump on

    done_flag = 1;

    //    sleepMode = false; // Disable Sleep Mode
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

    //    sleepMode = true; // Enable Sleep Mode
  }

  batteryMeasure();



  delay(100);
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
  int state = radio.receive(received_str); // <ID:DTH1 [SOIL]: 0,833,81.91,30.62,88,0>

  if (state == RADIOLIB_ERR_NONE)
  {
    // packet was successfully received
#if SERIAL_ENABLE
    Serial.println(F("Success!"));
#endif

#if SERIAL_ENABLE
    Serial.print(F("[SX1278] Data: "));
    Serial.println(received_str); // <ID:DTH1 [SOIL]: 0,0,880,89.17,33.28,97,0>

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

    // String received_str = <ID:DTH1 [SOIL]: 0,0,833,81.91,30.62,88,0>
    // String received_str = <ID:DTH1 [BASE]: 0,Status,highThreshold,lowThreshold,0>
    process_message(received_str);
  }

#if SERIAL_ENABLE
  else if (state == RADIOLIB_ERR_RX_TIMEOUT) {
    // timeout occurred while waiting for a packet
    Serial.println(F("timeout!"));
  }
  else if (state == RADIOLIB_ERR_CRC_MISMATCH) {
    // packet was received, but is malformed
    Serial.println(F("CRC error!"));
  }
  else {
    // some other error occurred
    Serial.print(F("failed, code "));
    Serial.println(state);
  }
#endif
}

//void all_pins_low()
//{
//  radio.sleep();
//  delay(1000);
//
//  lora_receive = false;
//
//  digitalWrite(IN1, LOW);
//  digitalWrite(IN2, LOW);
//  digitalWrite(PUMP_PIN, LOW);
//  delay(50);
//}
//
//ISR(WDT_vect)
//{
//#if DEBUG_OUT_ENABLE
//  Serial.print("[Watch dog]");
//  Serial.println(count);
//#endif
//  delay(100);
//  count++;
//
//  wdt_disable(); // disable watchdog
//}
//
//// Set low power mode and into sleep
//void low_power_set()
//{
//  all_pins_low();
//  delay(10);
//  // disable ADC
//  ADCSRA = 0;
//
//  sleep_enable();
//  watchdog_init();
//  set_sleep_mode(SLEEP_MODE_PWR_DOWN);
//  delay(10);
//  noInterrupts();
//  sleep_enable();
//
//  // turn off brown-out enable in software
//  MCUCR = bit(BODS) | bit(BODSE);
//  MCUCR = bit(BODS);
//  interrupts();
//
//  sleep_cpu();
//  sleep_disable();
//}
//
//// Enable watch dog
//void watchdog_init()
//{
//  // clear various "reset" flags
//  MCUSR = 0;
//  // allow changes, disable reset
//  WDTCSR = bit(WDCE) | bit(WDE);
//  WDTCSR = bit(WDIE) | bit(WDP3) | bit(WDP0); // set WDIE, and 8 seconds delay
//  wdt_reset();                                // pat the dog
//}

String getResetReason()
{
  String resetReason = "";
  if (MCUSR & (1 << WDRF))
  {
    resetReason = "Watchdog";
  }
  else if (MCUSR & (1 << BORF))
  {
    resetReason = "Brown-out";
  }
  else if (MCUSR & (1 << EXTRF))
  {
    resetReason = "External";
  }
  else if (MCUSR & (1 << PORF))
  {
    resetReason = "Power-on";
  }
  MCUSR = 0;
  wdt_disable();
  return resetReason;
}

void batteryMeasure()
{
  // ADC0 internal 3.3V as ADC reference voltage
  ADMUX = _BV(REFS1) | _BV(REFS0) | _BV(MUX3);

  delay(50);
  for (int i = 0; i < 3; i++)
  {
    // start ADC conversion
    ADMUX &= 0xF0; // Clear the MUX bits
    ADMUX |= 0x00; // Set MUX to select ADC0

    ADCSRA |= (1 << ADSC);

    delay(10);

    if ((ADCSRA & 0x40) == 0)
    {
      ADC_O_1 = ADCL;
      ADC_O_2 = ADCH;

      valveBattery = (ADC_O_2 << 8) + ADC_O_1;
      valveBattery = (valveBattery / 1023.0) * 100.0;
      ADCSRA |= 0x40;
#if SERIAL_ENABLE
      Serial.print("BAT:");
      Serial.print(valveBattery);

      float voltage = (valveBattery * 3.3) / 1024.0;
      Serial.print("Battery Voltage: ");
      Serial.print(voltage);
      Serial.println("V");
#endif
    }
    ADCSRA |= (1 << ADIF); // reset as required
    delay(50);
  }
}

void process_message(String message)
{

  message = message.substring(1, message.length() - 1); // Remove start and end characters
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

    lora_receive1 = false;
    lora_receive2 = true;
  }

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

    lora_receive2 = false;
    lora_receive1 = true;
  }
  else
  {
    // Do Nothing
  }
}
