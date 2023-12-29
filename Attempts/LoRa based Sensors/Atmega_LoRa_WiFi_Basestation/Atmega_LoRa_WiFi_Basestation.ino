// Written by Deepak Hadkar, last modified 03 Oct. 2022, 12:30 am

#include <RadioLib.h>
#include <avr/wdt.h>
#include <avr/sleep.h>

String node_id = String("ID:") + "DTH001";
String message_id = String("ID:") + "DTH001 [LoRa]: ";

//Lora set
//Set Lora frequency
#define FREQUENCY 434.0
// #define FREQUENCY 868.0
// #define FREQUENCY 915.0

// Unique antenna spec.(Must be same for trans-receive)
#define BANDWIDTH 125//125.0
#define SPREADING_FACTOR 11 //9
#define CODING_RATE 6
#define SX127X_SYNC_WORD 0x12
#define OUTPUT_POWER 17
#define PREAMBLE_LEN 8
#define GAIN 6

//328p
#define DIO0 2
#define DIO1 6

#define LORA_RST 4
#define LORA_CS 10

#define SPI_MOSI 11
#define SPI_MISO 12
#define SPI_SCK 13

#define VOLTAGE_PIN A0 // Read battery voltage
#define SENSOR_POWER_PIN 5 // RF98 Power pin

#define IN1 3
#define IN2 5
#define PUMP_PIN A1 // Relay for Pump

#define SERIAL_ENABLE 0

SX1278 radio = new Module(LORA_CS, DIO0, LORA_RST, DIO1);

bool readSensorStatus = false;
int sensorValue = 0; // variable to store the value coming from the sensor

int current_cursor = 0;
int lora_receive = 0;
int rec_valve_status, done_flag = 0;
int batPercent, batValue = 0;    // the voltage of battery
int count = 0;
int ADC_O_1;           // ADC Output First 8 bits
int ADC_O_2;           // ADC Output Next 2 bits

//Send-Receive LoRa strings
int soilIndex, soilMoisture, soilStatus, soilBattery, valveIndex, valveStatus, valveBattery, valve_status = 0;
float soilHumidity, soilTemperature;


void Lora_init()
{
  int state = radio.begin(FREQUENCY, BANDWIDTH, SPREADING_FACTOR, CODING_RATE, SX127X_SYNC_WORD, OUTPUT_POWER, PREAMBLE_LEN, GAIN);

  if (state == RADIOLIB_ERR_NONE)
  {

#if SERIAL_ENABLE
    Serial.println(F("Success!"));
    Serial.print(F("[SX1278] Datarate:\t"));
    Serial.print(radio.getDataRate());
    Serial.println(F(" bps"));
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

void setup() {
  Serial.begin(9600);
  delay(1000);
  Serial.println("Serial Initialise!");
  Serial.println(getResetReason());

#if SERIAL_ENABLE
  Serial.println("Valve start.");
#endif
  delay(100);

  pinMode(IN1, OUTPUT);
  pinMode(IN2, OUTPUT);
  digitalWrite(IN1, LOW);
  digitalWrite(IN2, LOW);

  pinMode(PUMP_PIN, OUTPUT);
  digitalWrite(PUMP_PIN, LOW);
  delay(100);

  pinMode(LORA_RST, OUTPUT);
  digitalWrite(LORA_RST, HIGH);
  delay(100);

  pinMode(SENSOR_POWER_PIN, OUTPUT);
  digitalWrite(SENSOR_POWER_PIN, HIGH); //Sensor power on
  delay(100);

  Lora_init();

  do_some_work();
  //setup over

#if SERIAL_ENABLE
  Serial.println("[Set]Sleep Mode Set");
#endif
  //  low_power_set();
}

void Valve_on()
{
  //  Serial.println(F("PUMP ON == Valve ON!"));
  digitalWrite(IN1, HIGH);
  digitalWrite(IN2, LOW);
  delay(100);
}
void Valve_off()
{
  //  Serial.println(F("PUMP OFF == Valve OFF!"));
  digitalWrite(IN1, LOW);
  digitalWrite(IN2, HIGH);
  delay(100);
}

void loop()
{

#if SERIAL_ENABLE
  //code start
  Serial.println("Code start>>");
#endif

  do_some_work();

#if SERIAL_ENABLE
  //code end

  //
#endif


  sendESP8266();

#if SERIAL_ENABLE
  //code end
  Serial.println("Code end>>");
#endif

}

void do_some_work()
{
  digitalWrite(LORA_RST, HIGH);
  delay(5);

  Lora_init();
  delay(50);


  while (lora_receive == 0)
  {
    receive_lora();
  }

  if (soilStatus == 1 && done_flag == 0)
  {
    Valve_on();
    digitalWrite(IN1, LOW);
    digitalWrite(IN2, LOW);
    delay(3000);

    digitalWrite(PUMP_PIN, HIGH); // Relay-Pump on
    //    Serial.println("Relay-Pump && Valve ON");

    valveStatus = 1;
    done_flag = 1;
  }

  if (soilStatus == 0 && done_flag == 1)
  {
    digitalWrite(PUMP_PIN, LOW); // Relay-Pump Off
    delay(1000);
    Valve_off();
    digitalWrite(IN1, LOW);
    digitalWrite(IN2, LOW);
    delay(3000);

    valveStatus = 0;
    done_flag = 0;
    //    Serial.println("Relay-Pump && Valve Off");
  }

  //ADC3  internal 1.1V as ADC reference voltage
  ADMUX = _BV(REFS1) | _BV(REFS0) | _BV(MUX1) | _BV(MUX0);

  delay(50);
  for (int i = 0; i < 3; i++)
  {
    //start ADC conversion
    ADCSRA |= (1 << ADSC);

    delay(10);

    if ((ADCSRA & 0x40) == 0)
    {
      ADC_O_1 = ADCL;
      ADC_O_2 = ADCH;

      batValue = (ADC_O_2 << 8) + ADC_O_1;
      valveBattery = batValue / 10;
      ADCSRA |= 0x40;
#if SERIAL_ENABLE
      Serial.print("BAT:");
      Serial.print(valveBattery);
      Serial.println("V");
#endif
    }
    ADCSRA |= (1 << ADIF); //reset as required
    delay(50);
  }
  send_lora();

  //  radio.sleep();

  valveIndex++;
  lora_receive = 0;
}

void send_lora()
{
  String message = " INEDX:" + (String)valveIndex + " VALVE_STATUS:" + (String)valveStatus + " BAT:" + (String)valveBattery + "%";
  String back_str = node_id + " [VALVE]" + message;

#if SERIAL_ENABLE
  Serial.println();
  Serial.println(back_str);
#endif
  radio.transmit(back_str); //ID:DTH001 [VALVE] INEDX:1 VALVE_STATUS:ON BAT:98%
}

void receive_lora()
{
  String received_str;
  int state = radio.receive(received_str); //ID:DTH001 [SOIL]: 0,1,5,81.91,30.62,1,88

  if (state == RADIOLIB_ERR_NONE) {
    // packet was successfully received
#if SERIAL_ENABLE
    Serial.println(F("Success!"));
#endif
    lora_receive = 1;

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
    //String received_str = "ID:DTH001 [SOIL]: 0,1,5,81.91,30.62,1,88 "

    // Convert the String to a C-style string
    char messageString[received_str.length() + 1];
    received_str.toCharArray(messageString, sizeof(messageString));

    // Split the string into tokens
    char *token;
    char *delimiters = ",";
    int tokenCount = 0;
    int maxTokens = 10;


    char *tokens[maxTokens];
    token = strtok(messageString, delimiters);
    while (token != NULL && tokenCount < maxTokens) {
      tokens[tokenCount++] = token;
      token = strtok(NULL, delimiters);
    }

    // Convert the tokens to numeric values
    soilIndex = atoi(tokens[1]);
    soilMoisture = atof(tokens[2]);
    soilHumidity = atof(tokens[3]);
    soilTemperature = atof(tokens[4]);
    soilStatus = atoi(tokens[5]);
    soilBattery = atoi(tokens[6]);

#if SERIAL_ENABLE
    Serial.print("Valve Status: "); Serial.println(soilStatus);
#endif

  }

#if SERIAL_ENABLE
  else if (state == RADIOLIB_ERR_RX_TIMEOUT) {
    // timeout occurred while waiting for a packet
    Serial.println(F("timeout!"));

  } else if (state == RADIOLIB_ERR_CRC_MISMATCH) {
    // packet was received, but is malformed
    Serial.println(F("CRC error!"));

  } else {
    // some other error occurred
    Serial.print(F("failed, code "));
    Serial.println(state);
  }
#endif

}

void sendESP8266()
{
  //  String loraMessage = "<ID:DTH001 [LoRa]: 0,1,5,81.91,30.62,1,88,1,0,98,0>";
  String loraMessage = message_id + "0," + (String)soilIndex + ',' + (String)soilMoisture + ',' + (String)soilHumidity + ',' + (String)soilTemperature + ',' + (String)soilStatus + ',' + (String)soilBattery + ',' + (String)valveIndex + ',' + (String)valveStatus + ',' + (String)valveBattery + ",0";

  Serial.println("<" + loraMessage + ">");
  Serial.flush(); // Wait for data to be fully transmitted
  delay(1000);
}

String getResetReason() {
  String resetReason = "";
  if (MCUSR & (1 << WDRF)) {
    resetReason = "Watchdog";
  } else if (MCUSR & (1 << BORF)) {
    resetReason = "Brown-out";
  } else if (MCUSR & (1 << EXTRF)) {
    resetReason = "External";
  } else if (MCUSR & (1 << PORF)) {
    resetReason = "Power-on";
  }
  MCUSR = 0;
  wdt_disable();
  return resetReason;
}
