#include <WiFi.h>
#include <WiFiUdp.h>
#include <Firebase_ESP_Client.h>

#include "addons/TokenHelper.h"
#include "addons/RTDBHelper.h"

// ---------- WiFi ----------
const char* WIFI_SSID = "YOUR_WIFI_SSID";
const char* WIFI_PASS = "YOUR_WIFI_PASSWORD";

// ---------- Firebase ----------
#define API_KEY "YOUR_FIREBASE_WEB_API_KEY"
#define DATABASE_URL "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com/"
#define USER_EMAIL "YOUR_FIREBASE_USER_EMAIL"
#define USER_PASSWORD "YOUR_FIREBASE_USER_PASSWORD"

const String FB_ROOT = "/testMesh";

// ---------- UDP ----------
const uint16_t HUB_PORT = 4210;
WiFiUDP udp;

// Keep last known endpoint for each node so hub can reply.
IPAddress node1Ip(0, 0, 0, 0);
uint16_t node1Port = 0;
IPAddress node2Ip(0, 0, 0, 0);
uint16_t node2Port = 0;

struct NodeState {
  int seq = 0;
  float temp = 0;
  int hum = 0;
  int cmdAck = 0;
  unsigned long lastSeen = 0;
};

NodeState node1;
NodeState node2;

// Commands controlled by Firebase stream and sent to nodes.
volatile int cmdNode1 = 0;
volatile int cmdNode2 = 0;
volatile int relayNode1 = 0;
volatile int relayNode2 = 0;

FirebaseData fbdo;
FirebaseData stream;
FirebaseAuth auth;
FirebaseConfig config;

unsigned long lastPushMs = 0;
unsigned long lastCmdSendMs = 0;

int countTokens(const String& s) {
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

void connectWiFi() {
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  while (WiFi.status() != WL_CONNECTED) {
    delay(300);
  }
}

void sendCmdToNode(const char* nodeId, IPAddress ip, uint16_t port, int cmd, int relay) {
  if (ip == IPAddress(0, 0, 0, 0) || port == 0) return;

  String msg = "CMD," + String(nodeId) + "," + String(cmd) + "," + String(relay);
  udp.beginPacket(ip, port);
  udp.write((const uint8_t*)msg.c_str(), msg.length());
  udp.endPacket();
}

void pushNodeStateToFirebase(const String& nodeId, const NodeState& st) {
  String base = FB_ROOT + "/nodes/" + nodeId;
  Firebase.RTDB.setInt(&fbdo, base + "/seq", st.seq);
  Firebase.RTDB.setFloat(&fbdo, base + "/temp", st.temp);
  Firebase.RTDB.setInt(&fbdo, base + "/hum", st.hum);
  Firebase.RTDB.setInt(&fbdo, base + "/cmdAck", st.cmdAck);
  Firebase.RTDB.setInt(&fbdo, base + "/lastSeenMs", (int)st.lastSeen);
  Firebase.RTDB.setInt(&fbdo, base + "/updatedAt", (int)millis());
}

void handleIncomingNodePacket() {
  int packetSize = udp.parsePacket();
  if (packetSize <= 0) return;

  char buf[192];
  int len = udp.read(buf, sizeof(buf) - 1);
  if (len <= 0) return;
  buf[len] = '\0';

  String s = String(buf);
  // Expected: NODE,node1,seq,temp,hum,lastCmdAck
  if (!s.startsWith("NODE,")) return;
  if (countTokens(s) < 6) return;

  String nodeId = tokenAt(s, 1);
  int seq = tokenAt(s, 2).toInt();
  float temp = tokenAt(s, 3).toFloat();
  int hum = tokenAt(s, 4).toInt();
  int cmdAck = tokenAt(s, 5).toInt();

  if (nodeId == "node1") {
    node1.seq = seq;
    node1.temp = temp;
    node1.hum = hum;
    node1.cmdAck = cmdAck;
    node1.lastSeen = millis();
    node1Ip = udp.remoteIP();
    node1Port = udp.remotePort();
  } else if (nodeId == "node2") {
    node2.seq = seq;
    node2.temp = temp;
    node2.hum = hum;
    node2.cmdAck = cmdAck;
    node2.lastSeen = millis();
    node2Ip = udp.remoteIP();
    node2Port = udp.remotePort();
  }
}

void streamCallback(FirebaseStream data) {
  String path = data.dataPath();
  int value = data.intData();

  // Accept updates on these paths:
  // /node1/cmd, /node1/relay, /node2/cmd, /node2/relay
  if (path == "/node1/cmd") cmdNode1 = value;
  else if (path == "/node1/relay") relayNode1 = value;
  else if (path == "/node2/cmd") cmdNode2 = value;
  else if (path == "/node2/relay") relayNode2 = value;
}

void streamTimeoutCallback(bool timeout) {
  if (timeout) {
    Serial.println("[Firebase] stream timeout, trying to continue...");
  }
}

void initFirebase() {
  config.api_key = API_KEY;
  config.database_url = DATABASE_URL;

  auth.user.email = USER_EMAIL;
  auth.user.password = USER_PASSWORD;

  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);

  // Create default command nodes.
  Firebase.RTDB.setInt(&fbdo, FB_ROOT + "/commands/node1/cmd", 0);
  Firebase.RTDB.setInt(&fbdo, FB_ROOT + "/commands/node1/relay", 0);
  Firebase.RTDB.setInt(&fbdo, FB_ROOT + "/commands/node2/cmd", 0);
  Firebase.RTDB.setInt(&fbdo, FB_ROOT + "/commands/node2/relay", 0);

  if (Firebase.RTDB.beginStream(&stream, FB_ROOT + "/commands")) {
    Firebase.RTDB.setStreamCallback(&stream, streamCallback, streamTimeoutCallback);
  } else {
    Serial.print("[Firebase] stream error: ");
    Serial.println(stream.errorReason());
  }
}

void setup() {
  Serial.begin(115200);
  delay(200);

  connectWiFi();
  udp.begin(HUB_PORT);
  initFirebase();

  Serial.print("[HUB] IP: ");
  Serial.println(WiFi.localIP());
}

void loop() {
  handleIncomingNodePacket();

  if (Firebase.ready() && millis() - lastPushMs >= 2000) {
    pushNodeStateToFirebase("node1", node1);
    pushNodeStateToFirebase("node2", node2);
    lastPushMs = millis();
  }

  if (millis() - lastCmdSendMs >= 1000) {
    sendCmdToNode("node1", node1Ip, node1Port, cmdNode1, relayNode1);
    sendCmdToNode("node2", node2Ip, node2Port, cmdNode2, relayNode2);
    lastCmdSendMs = millis();
  }
}
