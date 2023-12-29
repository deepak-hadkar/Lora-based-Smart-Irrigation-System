#include <FirebaseESP8266.h>
#include <WiFiManager.h>

#define FIREBASE_HOST "https://e-farm-d2031-default-rtdb.firebaseio.com/"
#define FIREBASE_AUTH "SgAgOkkygVXy9YSGEvTfzI7Sw7iHxliB7XUl4Hzz"

#define moisturePin A0

uint8_t dry_soil = 1023;
uint8_t wet_soil = 400;

FirebaseData firebaseData;
WiFiManager wm;

void setup()
{

  Serial.begin(115200);

  pinMode(moisturePin, INPUT);

  wm.autoConnect("Moisture1");
  wm.setConfigPortalTimeout(60);
  Serial.println();
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());
  Serial.println();

  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
  delay(3000);

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

void loop()
{
  int moisture = map(process_Moisture(), 100, 0, 10, 0);

  Serial.print("Moisture: ");
  Serial.println(moisture);

  Firebase.setFloat(firebaseData, "/VerticalFarming/MoistureSensors/Sensor1/Moisture", moisture);
  delay(1000);
}

int raw_Moisture()
{
  int raw_moisture;

  for (int i = 0; i <= 100; i++)
  {
    raw_moisture = raw_moisture + analogRead(moisturePin);
    delay(1);
  }
  raw_moisture = raw_moisture / 100.0;
  return raw_moisture;
}

int process_Moisture()
{
  int process_moisture;
  for (int j = 0; j <= 100; j++)
  {
    int process_moisture = map(raw_Moisture(), wet_soil, dry_soil, 100, 0);
    delay(1);
  }
  process_moisture = process_moisture / 100.0;
  return process_moisture;
}