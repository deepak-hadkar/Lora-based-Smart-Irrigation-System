// Written by Deepak Hadkar, last modified 30 Sept. 2022, 02:20 am

#include <Arduino.h>
#include <SPI.h>
#include <Wire.h>
#include <RadioLib.h>
#include <avr/wdt.h>
#include <avr/sleep.h>

// HS300x Sensor
#include <Catena-HS300x.h>
using namespace McciCatenaHs300x;
cHS300x gHs300x {Wire};
\
//#define NODENAME "LORA_POWER_1"
String node_id = String("ID:") + "DTH001";

//Set sleep time, when value is 1 almost sleep 8s,when value is 450, almost 1 hour.
#define SLEEP_CYCLE 1 // 225 // 450

//Lora set
//Set Lora frequency
#define FREQUENCY 434.0
// #define FREQUENCY 868.0
// #define FREQUENCY 915.0

// Unique antenna spec.(Must be same for trans-receive)
#define BANDWIDTH 125.0
#define SPREADING_FACTOR 9
#define CODING_RATE 7
#define SX127X_SYNC_WORD 0x12
#define OUTPUT_POWER 20
#define PREAMBLE_LEN 8
#define GAIN 0

//328p
#define DIO0 2
#define DIO1 6

#define LORA_RST 4
#define LORA_CS 10

#define SPI_MOSI 11
#define SPI_MISO 12
#define SPI_SCK 13

//pin set
#define VOLTAGE_PIN A3 // Read battery voltage
#define PWM_OUT_PIN 9 // 2MHz pwm_out
#define SENSOR_POWER_PIN 5 // RF98 Power pin
#define ADC_PIN A2 // Read moisture pin

#define SERIAL_ENABLE 1

SX1278 radio = new Module(LORA_CS, DIO0, LORA_RST, DIO1);


bool readSensorStatus = false;
int sensorValue = 0; // variable to store the value coming from the sensor

int dry_value = 880;
int wet_value = 500;
int moisture = 0;
int valve_status, valve_on  = 0;
int batPercent, batValue = 0;    // the voltage of battery
int datarateValue = 0; // Data rate of SX1278 in bps
int count = 0;
int ADC_O_1;           // ADC Output First 8 bits
int ADC_O_2;           // ADC Output Next 2 bits
int16_t packetnum = 0; // packet counter, we increment per xmission
float temperature = 0.0;
float humidity = 0.0;

bool HS300x_init()
{
  bool ret = false;
  //  Wire.begin();
  if (! gHs300x.begin())
  {
#if SERIAL_ENABLE
    Serial.println("HS300x not detected. Please check wiring. Freezing.");
#endif
  }

  cHS300x::Measurements m;
  float t, rh;

  if (gHs300x.getTemperatureHumidity(m) == true)
  {
    m.extract(t, rh);
    temperature = t;
    humidity = rh;
    ret = true;
  }
  if (! gHs300x.getTemperatureHumidity(m))
  {
#if SERIAL_ENABLE
    Serial.println(F("Failed to read from HS300x sensor!"));
#endif
  }
  return ret;
}
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
    // while (true)
    //     ;
  }
}
void setup()
{
  Serial.begin(9600);

  Serial.println("Serial Initialise!");
  Serial.println(getResetReason());

#if SERIAL_ENABLE
  Serial.println("Soil start.");
#endif
  delay(100);

  // set up Timer 1
  pinMode(PWM_OUT_PIN, OUTPUT);

  TCCR1A = bit(COM1A0);            // toggle OC1A on Compare Match
  TCCR1B = bit(WGM12) | bit(CS10); // CTC, scale to clock
  OCR1A = 1;

  pinMode(LORA_RST, OUTPUT);
  digitalWrite(LORA_RST, HIGH);
  delay(100);

  pinMode(SENSOR_POWER_PIN, OUTPUT);
  digitalWrite(SENSOR_POWER_PIN, HIGH); //Sensor power on
  delay(100);

  Lora_init();

  //  Wire.begin();
  if (! gHs300x.begin())
  {

#if SERIAL_ENABLE
    Serial.println("HS300x not detected. Please check wiring. Freezing.");
#endif
  }
#if SERIAL_ENABLE
  else
    Serial.println("HS300x acknowledged.");
#endif

  do_some_work();
  //setup over
#if SERIAL_ENABLE
  Serial.println("[Set]Sleep Mode Set");
#endif
  low_power_set();
}

void loop()
{
  wdt_disable();

  if (count > SLEEP_CYCLE) //(7+1) x 8S  450
  {
#if SERIAL_ENABLE
    //code start
    Serial.println("Code start>>");
#endif

    do_some_work();
    all_pins_low();

#if SERIAL_ENABLE
    //code end
    Serial.println("Code end<<");
#endif
    //count init
    count = 0;
  }

  low_power_set();
}

ISR(WDT_vect)
{
#if SERIAL_ENABLE
  Serial.print("[Watch dog]");
  Serial.println(count);
#endif
  delay(100);
  count++;
  //wdt_reset();
  wdt_disable(); // disable watchdog
}

//Set low power mode and into sleep
void low_power_set()
{
  all_pins_low();
  delay(10);
  // disable ADC
  ADCSRA = 0;

  sleep_enable();
  watchdog_init();
  set_sleep_mode(SLEEP_MODE_PWR_DOWN);
  delay(10);
  noInterrupts();
  sleep_enable();

  // turn off brown-out enable in software
  MCUCR = bit(BODS) | bit(BODSE);
  MCUCR = bit(BODS);
  interrupts();

  sleep_cpu();
  sleep_disable();
}

//Enable watch dog
void watchdog_init()
{
  // clear various "reset" flags
  MCUSR = 0;
  // allow changes, disable reset
  WDTCSR = bit(WDCE) | bit(WDE);
  WDTCSR = bit(WDIE) | bit(WDP3) | bit(WDP0); // set WDIE, and 8 seconds delay
  wdt_reset();                                // pat the dog
}

void do_some_work()
{

  digitalWrite(SENSOR_POWER_PIN, HIGH); // Sensor/RF95 power on
  digitalWrite(LORA_RST, HIGH);
  delay(5);
  pinMode(PWM_OUT_PIN, OUTPUT);    //digitalWrite(PWM_OUT_PIN, LOW);
  TCCR1A = bit(COM1A0);            // toggle OC1A on Compare Match
  TCCR1B = bit(WGM12) | bit(CS10); // CTC, scale to clock
  OCR1A = 1;                       // compare A register value (5000 * clock speed / 1024).When OCR1A == 1, PWM is 2MHz

  Lora_init();
  delay(50);

  //ADC2  AVCC as reference voltage
  ADMUX = _BV(REFS0) | _BV(MUX1);

  //ADC2  internal 1.1V as ADC reference voltage
  //ADMUX = _BV(REFS1) |_BV(REFS0) | _BV(MUX1);

  // 8  分频
  ADCSRA = _BV(ADEN) | _BV(ADPS1) | _BV(ADPS0);
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

      sensorValue = (ADC_O_2 << 8) + ADC_O_1;
      moisture = map(sensorValue, dry_value, wet_value, 0, 100);
      ADCSRA |= 0x40;
#if SERIAL_ENABLE
      Serial.print("ADC:");
      Serial.println(sensorValue);
      Serial.print("Moisture:");
      Serial.println(moisture);
#endif

      if (readSensorStatus == false)
        readSensorStatus = HS300x_init();
    }
    ADCSRA |= (1 << ADIF); //reset as required
    delay(50);
  }

  // Valve function
  if (moisture <= 30 && valve_on == 0)
  {
#if SERIAL_ENABLE
    Serial.print("Turning ON valve");
#endif

    valve_status = 1;
    valve_on = 1;
  }

  if (moisture >= 80 && valve_on == 1)
  {
#if SERIAL_ENABLE
    Serial.print("Turning OFF valve");
#endif

    valve_status = 0;
    valve_on = 0;
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
      batPercent = batValue / 10;
      ADCSRA |= 0x40;
#if SERIAL_ENABLE
      Serial.print("BAT:");
      Serial.println(batValue);
      float bat = (float)batValue * 3.3;
      bat = bat / 1024.0;
      Serial.print(bat);
      Serial.println("V");
#endif
    }
    ADCSRA |= (1 << ADIF); //reset as required
    delay(50);
  }
  send_lora();
  delay(1000);
  radio.sleep();

  packetnum++;
  readSensorStatus = false;
  digitalWrite(SENSOR_POWER_PIN, LOW); // Sensor/RF95 power off
  delay(100);
}

void all_pins_low()
{
  pinMode(PWM_OUT_PIN, INPUT);
  pinMode(A4, INPUT_PULLUP);
  pinMode(A5, INPUT_PULLUP);

  delay(50);
}

void send_lora()
{
  //String soilMessage = "ID:DTH001 [LoRa]: 0,1,5,81.91,30.62,1,88 ";
  String message = " 0," + (String)packetnum + ',' + (String)moisture + ',' + (String)humidity + ',' + (String)temperature + ',' + (String)valve_status + ',' + (String)batPercent + " ";
  String back_str = node_id + " [SOIL]:" + message;

  Serial.println(back_str);

  radio.transmit(back_str); //ID:DTH001 [SOIL]: 0,1,5,81.91,30.62,1,88
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