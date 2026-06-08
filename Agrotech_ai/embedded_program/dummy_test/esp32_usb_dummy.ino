#include <Arduino.h>

// Simple USB serial protocol for laptop bridge testing.
// Incoming from laptop:
//   DATA,SOIL,Temperature,30.1,Humidity,55,Moisture,42,Battery,90,MoistureThreshold,35,status,1
//   DATA,VALVE,status,1,flow,26,pressure,48,threshold,50,Battery,95
//   CMD,VALVE,status,1,threshold,55
//   CMD,SOIL,MoistureThreshold,40
// Outgoing to laptop:
//   ACK,...   (echo of accepted command)
//   HB,uptimeMs,soilStatus,valveStatus

int soilStatus = 0;
int valveStatus = 0;
int moistureThreshold = 35;
int valveThreshold = 50;
unsigned long lastHeartbeatMs = 0;

int tokenCount(const String& s) {
  if (s.length() == 0) return 0;
  int c = 1;
  for (unsigned int i = 0; i < s.length(); i++) {
    if (s[i] == ',') c++;
  }
  return c;
}

String tokenAt(const String& s, int index) {
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

void applyCommand(const String& line) {
  if (line.startsWith("CMD,VALVE,")) {
    for (int i = 2; i + 1 < tokenCount(line); i += 2) {
      String key = tokenAt(line, i);
      int value = tokenAt(line, i + 1).toInt();
      if (key == "status") valveStatus = value > 0 ? 1 : 0;
      if (key == "threshold") valveThreshold = value;
    }
    Serial.println("ACK," + line);
    return;
  }

  if (line.startsWith("CMD,SOIL,")) {
    for (int i = 2; i + 1 < tokenCount(line); i += 2) {
      String key = tokenAt(line, i);
      int value = tokenAt(line, i + 1).toInt();
      if (key == "MoistureThreshold") moistureThreshold = value;
      if (key == "status") soilStatus = value > 0 ? 1 : 0;
    }
    Serial.println("ACK," + line);
    return;
  }
}

void applyData(const String& line) {
  // Keep simple: only track status/threshold fields so you can verify round-trip.
  if (line.startsWith("DATA,SOIL,")) {
    for (int i = 2; i + 1 < tokenCount(line); i += 2) {
      String key = tokenAt(line, i);
      int value = tokenAt(line, i + 1).toInt();
      if (key == "status") soilStatus = value > 0 ? 1 : 0;
      if (key == "MoistureThreshold") moistureThreshold = value;
    }
    Serial.println("ACK," + line);
    return;
  }

  if (line.startsWith("DATA,VALVE,")) {
    for (int i = 2; i + 1 < tokenCount(line); i += 2) {
      String key = tokenAt(line, i);
      int value = tokenAt(line, i + 1).toInt();
      if (key == "status") valveStatus = value > 0 ? 1 : 0;
      if (key == "threshold") valveThreshold = value;
    }
    Serial.println("ACK," + line);
    return;
  }
}

void setup() {
  Serial.begin(115200);
  delay(150);
  Serial.println("ESP32 USB dummy ready");
}

void loop() {
  if (Serial.available()) {
    String line = Serial.readStringUntil('\n');
    line.trim();
    if (line.length() > 0) {
      if (line.startsWith("CMD,")) applyCommand(line);
      else if (line.startsWith("DATA,")) applyData(line);
      else Serial.println("ERR,UNKNOWN," + line);
    }
  }

  if (millis() - lastHeartbeatMs >= 3000) {
    Serial.print("HB,");
    Serial.print(millis());
    Serial.print(",");
    Serial.print(soilStatus);
    Serial.print(",");
    Serial.print(valveStatus);
    Serial.print(",");
    Serial.print(moistureThreshold);
    Serial.print(",");
    Serial.println(valveThreshold);
    lastHeartbeatMs = millis();
  }
}
