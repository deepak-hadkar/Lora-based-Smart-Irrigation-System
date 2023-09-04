// Written by Deepak Hadkar, last modified 03 Oct. 2022, 12:30 am
#include <RadioLib.h>
#include <avr/wdt.h>
#include <avr/sleep.h>

int datarateValue = 0; // Data rate of SX1278 in bps
int done_flag = 0;

int ADC_O_1; // ADC Output First 8 bits
int ADC_O_2; // ADC Output Next 2 bits

int dry_value = 880;
int wet_value = 470;
byte moisture = 0;

// Send-Receive LoRa strings
byte soilIndex, soilMoisture, soilStatus, soilBattery, valveIndex, valveStatus, valveBattery, valve_status, valveControl = 0;
byte highThreshold = 70;
byte lowThreshold = 30;
float soilHumidity, soilTemperature;

const byte MAX_VALUES = 10;       // set the maximum number of values to extract
int extractedValues[MAX_VALUES]; // create an array to store the extracted values
byte pos = 0;                 // initialize the position to zero
byte lastIndex = 0;           // initialize the index of the last comma to zero

// Set sleep time, when value is 1 almost sleep 8s,when value is 450, almost 1 hour.
#define SLEEP_CYCLE 2 // 450

// Set Lora frequency
#define FREQUENCY 434.0 // 434.0 // 915.0

// Unique antenna spec.(Must be same for trans-receive)
#define BANDWIDTH 125.0
#define SPREADING_FACTOR 9
#define CODING_RATE 7
#define SX127X_SYNC_WORD 0x12
#define OUTPUT_POWER 20
#define PREAMBLE_LEN 8
#define GAIN 0

// 328p
#define DIO0 2
#define DIO1 6

#define LORA_RST 4
#define LORA_CS 10

#define SPI_MOSI 11
#define SPI_MISO 12
#define SPI_SCK 13

#define VOLTAGE_PIN A0 // Read battery voltage

#define IN1 3
#define IN2 5
#define PUMP_PIN A1 // Relay for Pump

#define SERIAL_ENABLE 1

SX1278 radio = new Module(LORA_CS, DIO0, LORA_RST, DIO1);

String send_id = String("ID:") + "DTH1 [VALVE]: "; // ID:DHT1 [VALVE]:

void Lora_init()
{
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

  receive_lora(); // <ID:DTH1 [SOIL]: 0,0,880,89.17,33.28,97,0>

  delay(1000);
  send_lora(); // To Base-Station

  receive_lora(); // <ID: DTH1 [BASE]: 0,1,70,30,0>

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
