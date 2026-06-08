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

// ------------ Actuator pins (adjust to your hardware) ------------
#define IN1 5
#define IN2 3
#define PUMP_PIN A1
#define PIN_FLOW A2
#define PIN_PRESSURE A3
#define PIN_BAT A0

SX1278 radio = new Module(LORA_CS, DIO0, LORA_RST, DIO1);

int packetIndex = 0;
int valveStatus = 0;
int threshold = 50;
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

void applyOutputs() {
  if (valveStatus == 1) {
    digitalWrite(IN1, LOW);
    digitalWrite(IN2, HIGH);
    delay(80);
    digitalWrite(IN1, LOW);
    digitalWrite(IN2, LOW);
    digitalWrite(PUMP_PIN, HIGH);
  } else {
    digitalWrite(PUMP_PIN, LOW);
    digitalWrite(IN1, HIGH);
    digitalWrite(IN2, LOW);
    delay(80);
    digitalWrite(IN1, LOW);
    digitalWrite(IN2, LOW);
  }
}

void applyCommand(const String &rx) {
  // Expected: CMD,VALVE,status,<0|1>,threshold,<0..100>
  if (!rx.startsWith("CMD,VALVE,")) return;
  if (tokenCount(rx) < 4) return;

  for (int i = 2; i + 1 < tokenCount(rx); i += 2) {
    String key = tokenAt(rx, i);
    String value = tokenAt(rx, i + 1);

    if (key == "status") {
      valveStatus = value.toInt() > 0 ? 1 : 0;
    } else if (key == "threshold") {
      threshold = value.toInt();
      if (threshold < 0) threshold = 0;
      if (threshold > 100) threshold = 100;
    }
  }

  applyOutputs();
}

void receiveCommands() {
  String rx;
  int state = radio.receive(rx);
  if (state == RADIOLIB_ERR_NONE) {
    applyCommand(rx);
  }
}

void sendTelemetry() {
  int flow = readPercent(PIN_FLOW);
  int pressure = readPercent(PIN_PRESSURE);
  int battery = readPercent(PIN_BAT);

  // Format: VALVE,index,status,flow,pressure,threshold,battery
  String payload =
    "VALVE," + String(packetIndex) +
    "," + String(valveStatus) +
    "," + String(flow) +
    "," + String(pressure) +
    "," + String(threshold) +
    "," + String(battery);

  radio.transmit(payload);
  packetIndex++;
}

void setup() {
  Serial.begin(115200);
  delay(200);

  pinMode(LORA_RST, OUTPUT);
  digitalWrite(LORA_RST, HIGH);

  pinMode(IN1, OUTPUT);
  pinMode(IN2, OUTPUT);
  pinMode(PUMP_PIN, OUTPUT);
  digitalWrite(PUMP_PIN, LOW);

  pinMode(PIN_FLOW, INPUT);
  pinMode(PIN_PRESSURE, INPUT);
  pinMode(PIN_BAT, INPUT);

  initRadio();
  applyOutputs();
}

void loop() {
  receiveCommands();

  if (millis() - lastTxMs >= 5000) {
    sendTelemetry();
    lastTxMs = millis();
  }
}
