#include <FirebaseESP8266.h>
#include <WiFiManager.h>

#define FIREBASE_HOST "e-farm-d2031-default-rtdb.firebaseio.com" // Your Firebase Project URL goes here without "http:" , "\" and "/"
#define FIREBASE_AUTH "SgAgOkkygVXy9YSGEvTfzI7Sw7iHxliB7XUl4Hzz" // Your Firebase Auth TokenToken

FirebaseData firebaseData;
WiFiManager wm;

uint8_t IN1 = D8;
uint8_t IN2 = D4;
uint8_t CTRL = D2;

int valve_on, done_flag = 0;

void setup()
{
  Serial.begin(115200);

  pinMode(IN1, OUTPUT);
  pinMode(IN2, OUTPUT);
  pinMode(CTRL, OUTPUT);

  wm.autoConnect("Valve1");
  wm.setConfigPortalTimeout(60);
  Serial.println();
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());
  Serial.println();

  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
  delay(1000);

  if (!Firebase.beginStream(firebaseData, "Electriculture"))
  {
    Serial.println("------------------------------------");
    Serial.println("Can't begin stream connection...");
    Serial.println("REASON: " + firebaseData.errorReason());
    Serial.println("------------------------------------");
    Serial.println();
  }
  else
  {
    Serial.println("Stream success");
  }
}
void Valve_on()
{
  digitalWrite(CTRL, HIGH);
  digitalWrite(IN1, LOW);
  digitalWrite(IN2, HIGH);
  delay(80);
}
void Valve_off()
{
  digitalWrite(CTRL, HIGH);
  digitalWrite(IN1, HIGH);
  digitalWrite(IN2, LOW);
  delay(80);
}
void Supply_off()
{
  digitalWrite(CTRL, LOW);
  digitalWrite(IN1, LOW);
  digitalWrite(IN2, LOW);
}
void loop()
{
  if (Firebase.getString(firebaseData, "/VerticalFarming/Valves/Valve1"))
  { // On successful Read operation, function returns 1
    String raw_valve = firebaseData.stringData();
    valve_on = raw_valve.toInt();
  }
  if (valve_on == 0 && done_flag == 0)
  {
    Valve_on();
    done_flag = 1;
    Supply_off()
  }
  if (valve_on == 1 && done_flag == 1)
  {
    Valve_off();
    done_flag = 0;
    Supply_off()
  }
}