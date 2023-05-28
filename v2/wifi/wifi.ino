#include <NTPClient.h>
#include <WiFiUdp.h>

uint16_t utcOffsetInSeconds = 19800;
// Define NTP Client to get time
WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP, "in.pool.ntp.org", utcOffsetInSeconds);

#include <WiFiManager.h>
WiFiManager wm;
#include <FirebaseESP8266.h>

#include <addons/TokenHelper.h>
#include <addons/RTDBHelper.h>

#define DATABASE_URL "https://efarm-dashboard-default-rtdb.firebaseio.com/"
#define API_KEY "AIzaSyAbdlXLeHw5cUyB9OnlhNuXZPQRbg8NID8"

#define USER_EMAIL "sample@gmail.com"
#define USER_PASSWORD "12345678"
// User UID: 5HIdbcbsoce04nfg9sPENa8qinI2

FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

unsigned long sendDataPrevMillis = 0;

const int MAX_VALUES = 10;       // set the maximum number of values to extract
int extractedValues[MAX_VALUES]; // create an array to store the extracted values
uint8_t pos = 0;                 // initialize the position to zero
uint8_t lastIndex = 0;           // initialize the index of the last comma to zero

uint8_t count = 0;
String values, uid;

bool done = false;

String received_message = ""; //<ID:DTH001 [LoRa]: 0,1,5,81.91,30.62,1,88,1,0,98,0>
uint8_t soilIndex, soilMoisture, soilStatus, soilBattery, valveIndex, valveStatus, valveBattery, valve_status, soilHumidity, soilTemperature;

void initWiFi()
{
  wm.autoConnect("SmartAgro Basestation");
  wm.setConfigPortalTimeout(60);
}
void firebaseAuth()
{
  config.api_key = API_KEY;
  auth.user.email = USER_EMAIL;
  auth.user.password = USER_PASSWORD;
  config.database_url = DATABASE_URL;
  config.token_status_callback = tokenStatusCallback;

  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);
  Firebase.setDoubleDigits(5);
  delay(200);

  //  Serial.println("Getting User UID");
  while ((auth.token.uid) == "")
  {
    //    Serial.print('.');
    delay(1000);
  }
  uid = auth.token.uid.c_str();
  Serial.print("User UID: ");
  Serial.print(uid);
}

void setup()
{
  Serial.begin(9600);
  timeClient.begin();
  delay(1000);

  initWiFi();
  firebaseAuth();
}

void loop()
{
  receiveBase();
  firebaseUpdate();
  sendBase();
}
void firebaseUpdate()
{
  if (Firebase.ready() && (millis() - sendDataPrevMillis > 15000 || sendDataPrevMillis == 0))
  {
    updateFirebase();
    count++;
  }
  if (Firebase.isTokenExpired())
  {
    Firebase.refreshToken(&config);
    Serial.println("Refresh token");
  }
}
void receiveBase()
{
  while (Serial.available() > 0 || !done)
  {
    char incoming_char = Serial.read();
    // Check if start character is received
    if (incoming_char == '<')
    {
      received_message = "";
    }

    received_message += incoming_char;

    if (incoming_char == '>')
    {
      process_message(received_message);
      done = true;
    }
  }
}
void sendBase()
{
  //  String loraMessage = "<ID:DTH1 [WIFI]: 0,1,75,30,0>";
  String loraMessage = send_id + "0," + (String)valveControl + ',' + (String)highThreshold + ',' + (String)lowThreshold + ",0";
  Serial.println("<" + loraMessage + ">");
  Serial.flush(); // Wait for data to be fully transmitted
  delay(1000);
}

void process_message(String message)
{
  // Remove start and end characters
  message = message.substring(1, message.length() - 1);
  if (message.startsWith("ID:DTH001 [LoRa]: "))
  {                        // check if the message is valid
    message.remove(0, 18); // remove the ID and protocol information from the message
  }
#if SERIAL_ENABLE
  Serial.println("Received data: " + message);
#endif

  pos = 0;       // reset the number of extracted values to zero
  lastIndex = 0; // initialize the index of the last comma to zero

  for (int i = 0; i < message.length() && pos < MAX_VALUES; i++)
  { // loop through the string
    if (message.charAt(i) == ',')
    {                                                                   // if a comma is found
      extractedValues[pos++] = message.substring(lastIndex, i).toInt(); // extract the value and convert it to integer
      lastIndex = i + 1;                                                // set the index of the last comma to the next character after the comma
    }
  }
  extractedValues[pos++] = message.substring(lastIndex).toInt(); // extract the last value and convert it to integer

  soilIndex = extractedValues[1];
  soilMoisture = extractedValues[2];
  soilHumidity = extractedValues[3];
  soilTemperature = extractedValues[4];
  soilStatus = extractedValues[5];
  soilBattery = extractedValues[6];
  valveIndex = extractedValues[7];
  valveStatus = extractedValues[8];
  valveBattery = extractedValues[9];

  delay(1000);

  if (valveStatus == 0)
  {
    updateTime(0);
  }
  else if (valveStatus == 1)
  {
    updateTime(1);
  }
}

void updateFirebase()
{
  Firebase.setInt(fbdo, ("user/" + uid + "/sensor/Index"), soilIndex);
  Firebase.setInt(fbdo, ("user/" + uid + "/sensor/Moisture"), soilMoisture);
  Firebase.setInt(fbdo, ("user/" + uid + "/sensor/Humidity"), soilHumidity);
  Firebase.setInt(fbdo, ("user/" + uid + "/sensor/Temperature"), soilTemperature);
  Firebase.setInt(fbdo, ("user/" + uid + "/sensor/Status"), soilStatus);
  Firebase.setInt(fbdo, ("user/" + uid + "/sensor/Battery"), soilBattery);

  Firebase.setInt(fbdo, ("user/" + uid + "/actuator/Index"), valveIndex);
  Firebase.setInt(fbdo, ("user/" + uid + "/actuator/Status"), valveStatus);
  Firebase.setInt(fbdo, ("user/" + uid + "/actuator/Battery"), valveBattery);

  if (Firebase.getInt(firebaseData, ("user/" + uid + "/sensor/status")))
  {
    int value = firebaseData.intData();
    Serial.print("Received value: ");
    Serial.println(value);
  }
  if (Firebase.getInt(firebaseData, ("user/" + uid + "/sensor/highThreshold")))
  {
    int value = firebaseData.intData();
    Serial.print("Received value: ");
    Serial.println(value);
  }
  if (Firebase.getInt(firebaseData, ("user/" + uid + "/actuator/lowThreshold")))
  {
    int value = firebaseData.intData();
    Serial.print("Received value: ");
    Serial.println(value);
  }

  Serial.println("Updated Firebase!!!");
}

void updateTime(int status_bit)
{
  timeClient.update();
  delay(1000);

  String current_timeStamp = (String)timeClient.getFormattedTime();
  Serial.print("Current timestamp: ");
  Serial.println(current_timeStamp);
  if (status_bit == 0)
  {
    Firebase.setString(fbdo, ("user/" + uid + "/actuator/OffTime"), current_timeStamp);
  }
  else if (status_bit == 1)
  {
    Firebase.setString(fbdo, ("user/" + uid + "/actuator/OnTime"), current_timeStamp);
  }
  else
  {
    Serial.print("Error timestamp");
  }
  delay(200);
}
