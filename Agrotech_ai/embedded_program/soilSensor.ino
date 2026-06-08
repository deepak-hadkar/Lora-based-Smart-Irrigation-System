#include <RadioLib.h>

// ------------ LoRa radio setup ------------
#define FREQUENCY 434.0
#define BANDWIDTH 125.0
#define SPREADING_FACTOR 9
#define CODING_RATE 7
#define SX127X_SYNC_WORD 0x12
#define OUTPUT_POWER 17
#define PREAMBLE_LEN 8
#define GAIN 0

#define DIO0 2
#define DIO1 6
#define LORA_RST 4
#define LORA_CS 10

// ------------ Sensor pins (adjust to your hardware) ------------
#define PIN_SOIL A0
#define PIN_HUM A1
#define PIN_TEMP A2
#define PIN_BAT A3

SX1278 radio = new Module(LORA_CS, DIO0, LORA_RST, DIO1);

int sampleIndex = 0;
int moistureThreshold = 35;
unsigned long lastTxMs = 0;

void initRadio() {
  int state = radio.begin(FREQUENCY, BANDWIDTH, SPREADING_FACTOR, CODING_RATE, SX127X_SYNC_WORD, OUTPUT_POWER, PREAMBLE_LEN, GAIN);
  if (state != RADIOLIB_ERR_NONE) {
    Serial.print("[LoRa] init failed: ");
    Serial.println(state);
  }
}

int tokenCount(const String &s) {
  if (s.length() == 0) return 0;
  int count = 1;
  for (unsigned int i = 0; i < s.length(); i++) {
    if (s[i] == ',') count++;
  }
  return count;
}

String tokenAt(const String &s, int index) {
  int start = 0;
  int current = 0;
  for (unsigned int i = 0; i <= s.length(); i++) {
    if (i == s.length() || s[i] == ',') {
      if (current == index) return s.substring(start, i);
      current++;
      start = i + 1;
    }
  }
  return "";
}

int readPercent(int pin) {
  int raw = analogRead(pin);
  int pct = map(raw, 0, 1023, 0, 100);
  if (pct < 0) pct = 0;
  if (pct > 100) pct = 100;
  return pct;
}

float readTemperatureC() {
  int raw = analogRead(PIN_TEMP);
  // Placeholder conversion. Replace with real sensor conversion.
  return (raw / 1023.0f) * 50.0f;
}

float readHumidityPct() {
  int raw = analogRead(PIN_HUM);
  return (raw / 1023.0f) * 100.0f;
}

void applyCommand(const String &rx) {
  // Expected: CMD,SOIL,MoistureThreshold,<value>
  if (!rx.startsWith("CMD,SOIL,")) return;
  if (tokenCount(rx) < 4) return;

  String key = tokenAt(rx, 2);
  String value = tokenAt(rx, 3);

  if (key == "MoistureThreshold") {
    moistureThreshold = value.toInt();
    if (moistureThreshold < 0) moistureThreshold = 0;
    if (moistureThreshold > 100) moistureThreshold = 100;
  }
}

void receiveCommands() {
  String rx;
  int state = radio.receive(rx);
  if (state == RADIOLIB_ERR_NONE) {
    applyCommand(rx);
  }
}

void sendTelemetry() {
  int moisture = readPercent(PIN_SOIL);
  float humidity = readHumidityPct();
  float temperature = readTemperatureC();
  int battery = readPercent(PIN_BAT);

  int requestOpen = (moisture < moistureThreshold) ? 1 : 0;

  // Format: SOIL,index,moisture,humidity,temperature,requestOpen,battery,MoistureThreshold
  String payload =
    "SOIL," + String(sampleIndex) +
    "," + String(moisture) +
    "," + String(humidity, 2) +
    "," + String(temperature, 2) +
    "," + String(requestOpen) +
    "," + String(battery) +
    "," + String(moistureThreshold);

  radio.transmit(payload);
  sampleIndex++;
}

void setup() {
  Serial.begin(115200);
  delay(200);

  pinMode(LORA_RST, OUTPUT);
  digitalWrite(LORA_RST, HIGH);

  pinMode(PIN_SOIL, INPUT);
  pinMode(PIN_HUM, INPUT);
  pinMode(PIN_TEMP, INPUT);
  pinMode(PIN_BAT, INPUT);

  initRadio();
}

void loop() {
  receiveCommands();

  if (millis() - lastTxMs >= 5000) {
    sendTelemetry();
    lastTxMs = millis();
  }
}
