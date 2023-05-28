// Written by Deepak Hadkar, last modified 30 Sept. 2022, 02:20 am

#include "customs.h"
#include "defines.h"

String node_id = String("ID:") + "DTH1" + " [SOIL]:"; // ID:DHT1 [SOIL]:

bool HS3004_init()
{
  bool ret = false;
  //  Wire.begin();
  if (!gHs300x.begin())
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
  if (!gHs300x.getTemperatureHumidity(m))
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
  }
}

void setup()
{
#if SERIAL_ENABLE
  Serial.begin(9600);
  delay(1000);
  Serial.println("Soil start.");
  delay(100);
#endif

  pinMode(SENSOR_POWER_PIN, OUTPUT);
  digitalWrite(SENSOR_POWER_PIN, HIGH); // Sensor power on
  delay(1000);

  // set up Timer 1
  pinMode(PWM_OUT_PIN, OUTPUT);

  TCCR1A = bit(COM1A0);            // toggle OC1A on Compare Match
  TCCR1B = bit(WGM12) | bit(CS10); // CTC, scale to clock
  OCR1A = 1;

  pinMode(LORA_RST, OUTPUT);
  digitalWrite(LORA_RST, HIGH);
  delay(100);

  Lora_init();

  HS3004_init();

  do_some_work(); // setup over

#if SERIAL_ENABLE
  Serial.println("[Set]Sleep Mode Set");
#endif
  low_power_set();
}

void loop()
{
  wdt_disable();

  if (count > SLEEP_CYCLE) //(7+1) x 8S = 450
  {
#if SERIAL_ENABLE
    Serial.println("Code start>>"); // code start
#endif

    do_some_work();

#if SERIAL_ENABLE
    Serial.println("Code end<<"); // code end
#endif

    count = 0; // count init
  }

  low_power_set();
}

void do_some_work()
{
  digitalWrite(SENSOR_POWER_PIN, HIGH); // Sensor/RF95 power on
  delay(1000);

  digitalWrite(LORA_RST, HIGH);
  delay(5);

  pinMode(PWM_OUT_PIN, OUTPUT);    // digitalWrite(PWM_OUT_PIN, LOW);
  TCCR1A = bit(COM1A0);            // toggle OC1A on Compare Match
  TCCR1B = bit(WGM12) | bit(CS10); // CTC, scale to clock
  OCR1A = 1;                       // compare A register value (5000 * clock speed / 1024).When OCR1A == 1, PWM is 2MHz

  Lora_init();
  delay(50);

  soilMeasure();

  batteryMeasure();

  send_lora();
  delay(100);
}

void send_lora()
{
  String message = node_id + " 0," + (String)soilIndex + ',' + (String)soilMoisture + "," + (String)humidity + "," + (String)temperature + "," + (String)batValue + ",0";
  String loraMessage = "<" + message + ">";

#if SERIAL_ENABLE
  Serial.println();
  Serial.println(loraMessage);
#endif
  radio.transmit(loraMessage); //<ID:DTH1 [SOIL]: 0,0,833,81.91,30.62,88,0>

  soilIndex++;
  delay(100);
}

ISR(WDT_vect)
{
#if SERIAL_ENABLE
  Serial.print("[Watch dog]");
  Serial.println(count);
#endif
  delay(100);
  count++;
  wdt_disable(); // disable watchdog
}

// Enable watch dog
void watchdog_init()
{
  // clear various "reset" flags
  MCUSR = 0;
  // allow changes, disable reset
  WDTCSR = bit(WDCE) | bit(WDE);
  WDTCSR = bit(WDIE) | bit(WDP3) | bit(WDP0); // set WDIE, and 8 seconds delay
  wdt_reset();                                // pat the dog
}

void all_pins_low()
{
  radio.sleep();
  delay(1000);
  digitalWrite(SENSOR_POWER_PIN, LOW); // Sensor/RF95 power off

  readSensorStatus = false;

  pinMode(PWM_OUT_PIN, INPUT);
  pinMode(A4, INPUT_PULLUP);
  pinMode(A5, INPUT_PULLUP);
}

// Set low power mode and into sleep
void low_power_set()
{
  all_pins_low();
  delay(100);
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

void soilMeasure()
{
  // ADC2  AVCC as reference voltage
  ADMUX = _BV(REFS0) | _BV(MUX1);

  ADCSRA = _BV(ADEN) | _BV(ADPS1) | _BV(ADPS0); // 8 MHz
  // ADCSRA = _BV(ADEN) | _BV(ADPS2) | _BV(ADPS1) | _BV(ADPS0);  //16 MHz

  delay(50);
  for (int i = 0; i < 3; i++)
  {
    // start ADC conversion
    ADCSRA |= (1 << ADSC);

    delay(10);

    if ((ADCSRA & 0x40) == 0)
    {
      ADC_O_1 = ADCL;
      ADC_O_2 = ADCH;

      soilMoisture = (ADC_O_2 << 8) + ADC_O_1;
      // moisture = map(soilMoisture, dry_value, wet_value, 0, 100);
      ADCSRA |= 0x40;

      if (readSensorStatus == false)
        readSensorStatus = HS3004_init();
    }
    ADCSRA |= (1 << ADIF); // reset as required
    delay(50);
  }
#if SERIAL_ENABLE
  Serial.print("ADC:");
  Serial.println(soilMoisture);
#endif
}

void batteryMeasure()
{
  // ADC3  internal 1.1V as ADC reference voltage
  ADMUX = _BV(REFS1) | _BV(REFS0) | _BV(MUX1) | _BV(MUX0);

  delay(50);
  for (int i = 0; i < 3; i++)
  {
    // start ADC conversion
    ADCSRA |= (1 << ADSC);

    delay(10);

    if ((ADCSRA & 0x40) == 0)
    {
      ADC_O_1 = ADCL;
      ADC_O_2 = ADCH;

      batValue = (ADC_O_2 << 8) + ADC_O_1;
      ADCSRA |= 0x40;
    }
    ADCSRA |= (1 << ADIF); // reset as required
    delay(50);
  }
#if SERIAL_ENABLE
  Serial.print("BAT:");
  Serial.println(batValue);

  float voltage = (batValue * 1.1) / 1024.0;
  Serial.print("Battery Voltage: ");
  Serial.print(voltage);
  Serial.println("V");
#endif
}
