#include <ESP8266WiFi.h>
#include <WiFiUdp.h>

// ---------- WiFi ----------
const char* WIFI_SSID = "YOUR_WIFI_SSID";
const char* WIFI_PASS = "YOUR_WIFI_PASSWORD";

// ---------- Hub endpoint ----------
IPAddress HUB_IP(192, 168, 1, 50);   // Change to HUB ESP32 IP
const uint16_t HUB_PORT = 4210;
const uint16_t LOCAL_PORT = 4211;

// ---------- Node identity ----------
const char* NODE_ID = "node1";

WiFiUDP udp;

int seqNo = 0;
int lastCmd = 0;
unsigned long lastSendMs = 0;

void connectWiFi() {
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  while (WiFi.status() != WL_CONNECTED) {
    delay(300);
  }
}

void sendDummyTelemetry() {
  float temp = 20.0 + (random(0, 150) / 10.0);  // 20.0 to 35.0
  int hum = random(35, 81);                      // 35 to 80

  String msg = "NODE," + String(NODE_ID) + "," + String(seqNo) + "," + String(temp, 1) + "," + String(hum) + "," + String(lastCmd);

  udp.beginPacket(HUB_IP, HUB_PORT);
  udp.write((const uint8_t*)msg.c_str(), msg.length());
  udp.endPacket();

  seqNo++;
}

void handleHubReply() {
  int packetSize = udp.parsePacket();
  if (packetSize <= 0) return;

  char buf[128];
  int len = udp.read(buf, sizeof(buf) - 1);
  if (len <= 0) return;
  buf[len] = '\0';

  // Format: CMD,node1,cmdValue,relay
  String s = String(buf);
  if (!s.startsWith("CMD,")) return;

  int p1 = s.indexOf(',');
  int p2 = s.indexOf(',', p1 + 1);
  int p3 = s.indexOf(',', p2 + 1);
  if (p1 < 0 || p2 < 0 || p3 < 0) return;

  String target = s.substring(p1 + 1, p2);
  if (target != NODE_ID && target != "ALL") return;

  lastCmd = s.substring(p2 + 1, p3).toInt();
  int relayState = s.substring(p3 + 1).toInt();

  // Dummy behavior: print command and relay state
  Serial.print("[NODE1] cmd=");
  Serial.print(lastCmd);
  Serial.print(" relay=");
  Serial.println(relayState);
}

void setup() {
  Serial.begin(115200);
  delay(150);

  randomSeed(ESP.getChipId());

  connectWiFi();
  udp.begin(LOCAL_PORT);

  Serial.print("[NODE1] IP: ");
  Serial.println(WiFi.localIP());
}

void loop() {
  handleHubReply();

  if (millis() - lastSendMs >= 2000) {
    sendDummyTelemetry();
    lastSendMs = millis();
  }
}
