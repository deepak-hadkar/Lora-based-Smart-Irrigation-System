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

#define SERIAL_BAUD 115200

SX1278 radio = new Module(LORA_CS, DIO0, LORA_RST, DIO1);

// ------------ Firebase mapping ------------
const String UID = "5HIdbcbsoce04nfg9sPENa8qinI2";
const String SENSOR_PATH = "user/" + UID + "/devices/sensor1";
const String VALVE_PATH = "user/" + UID + "/devices/actuator1";

// ------------ Device state ------------
struct SoilState {
  int index = 0;
  int moisture = 0;
  float humidity = 0;
  float temperature = 0;
  int requestOpen = 0;
  int battery = 0;
  int moistureThreshold = 35;
  unsigned long ts = 0;
} soil;

struct ValveState {
  int index = 0;
  int status = 0;
  int flow = 0;
  int pressure = 0;
  int threshold = 50;
  int battery = 0;
  unsigned long ts = 0;
} valve;

int desiredValveStatus = 0;
int desiredValveThreshold = 50;
int desiredMoistureThreshold = 35;

unsigned long lastPublishMs = 0;
unsigned long lastCommandBroadcastMs = 0;

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
      if (current == index) {
        return s.substring(start, i);
      }
      current++;
      start = i + 1;
    }
  }
  return "";
}

void parseSoilPacket(const String &payload) {
  // Format: SOIL,index,moisture,humidity,temperature,requestOpen,battery,MoistureThreshold
  if (tokenCount(payload) < 8) return;

  soil.index = tokenAt(payload, 1).toInt();
  soil.moisture = tokenAt(payload, 2).toInt();
  soil.humidity = tokenAt(payload, 3).toFloat();
  soil.temperature = tokenAt(payload, 4).toFloat();
  soil.requestOpen = tokenAt(payload, 5).toInt();
  soil.battery = tokenAt(payload, 6).toInt();
  soil.moistureThreshold = tokenAt(payload, 7).toInt();
  soil.ts = millis();
}

void parseValvePacket(const String &payload) {
  // Format: VALVE,index,status,flow,pressure,threshold,battery
  if (tokenCount(payload) < 7) return;

  valve.index = tokenAt(payload, 1).toInt();
  valve.status = tokenAt(payload, 2).toInt();
  valve.flow = tokenAt(payload, 3).toInt();
  valve.pressure = tokenAt(payload, 4).toInt();
  valve.threshold = tokenAt(payload, 5).toInt();
  valve.battery = tokenAt(payload, 6).toInt();
  valve.ts = millis();
}

void handleLoraReceive() {
  String rx;
  int state = radio.receive(rx);
  if (state != RADIOLIB_ERR_NONE) return;

  if (rx.startsWith("SOIL,")) {
    parseSoilPacket(rx);
  } else if (rx.startsWith("VALVE,")) {
    parseValvePacket(rx);
  }
}

void printFbSetLine(const String &path, const String &csvKv) {
  // ESP bridge should parse this and write each key under path.
  // Frame format: <FBSET,path,key1=v1,key2=v2,...>
  Serial.print("<FBSET,");
  Serial.print(path);
  Serial.print(",");
  Serial.print(csvKv);
  Serial.println(">\n");
}

void publishToBridge() {
  String sensorKv =
    "type=sensor"
    ",Index=" + String(soil.index) +
    ",Moisture=" + String(soil.moisture) +
    ",Humidity=" + String(soil.humidity, 2) +
    ",Temperature=" + String(soil.temperature, 2) +
    ",MoistureThreshold=" + String(soil.moistureThreshold) +
    ",Battery=" + String(soil.battery) +
    ",status=" + String(soil.requestOpen) +
    ",Timestamp=" + String(millis());

  String valveKv =
    "type=actuator"
    ",status=" + String(valve.status) +
    ",flow=" + String(valve.flow) +
    ",pressure=" + String(valve.pressure) +
    ",threshold=" + String(valve.threshold) +
    ",Battery=" + String(valve.battery) +
    ",Timestamp=" + String(millis());

  printFbSetLine(SENSOR_PATH, sensorKv);
  printFbSetLine(VALVE_PATH, valveKv);
}

void sendValveCommand() {
  String cmd = "CMD,VALVE,status," + String(desiredValveStatus) + ",threshold," + String(desiredValveThreshold);
  radio.transmit(cmd);
}

void sendSoilCommand() {
  String cmd = "CMD,SOIL,MoistureThreshold," + String(desiredMoistureThreshold);
  radio.transmit(cmd);
}

void handleBridgeCommand(const String &line) {
  // Expected frame from ESP bridge:
  // <CMD,deviceId,key,value>
  if (!line.startsWith("<CMD,") || !line.endsWith(">")) return;

  String body = line.substring(1, line.length() - 1);
  if (tokenCount(body) < 4) return;

  String deviceId = tokenAt(body, 1);
  String key = tokenAt(body, 2);
  String value = tokenAt(body, 3);

  if (deviceId == "actuator1") {
    if (key == "status") desiredValveStatus = value.toInt();
    if (key == "threshold") desiredValveThreshold = value.toInt();
    sendValveCommand();
  } else if (deviceId == "sensor1") {
    if (key == "MoistureThreshold") desiredMoistureThreshold = value.toInt();
    sendSoilCommand();
  }
}

void readBridgeSerial() {
  if (!Serial.available()) return;
  String line = Serial.readStringUntil('\n');
  line.trim();
  if (line.length() == 0) return;
  handleBridgeCommand(line);
}

void setup() {
  Serial.begin(SERIAL_BAUD);
  delay(200);
  pinMode(LORA_RST, OUTPUT);
  digitalWrite(LORA_RST, HIGH);
  initRadio();
}

void loop() {
  handleLoraReceive();
  readBridgeSerial();

  if (millis() - lastPublishMs >= 2000) {
    publishToBridge();
    lastPublishMs = millis();
  }

  if (millis() - lastCommandBroadcastMs >= 5000) {
    sendValveCommand();
    sendSoilCommand();
    lastCommandBroadcastMs = millis();
  }
}
