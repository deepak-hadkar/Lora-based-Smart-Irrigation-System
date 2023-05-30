#include <NTPClient.h>
#include <WiFiUdp.h>
uint16_t utcOffsetInSeconds = 19800;
// Define NTP Client to get time
WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP, "in.pool.ntp.org", utcOffsetInSeconds);

#include <ESP8266WiFi.h>
#include "HTTPSRedirect.h"
#include "DebugMacros.h"
String sheetHumid = "";
String sheetTemp = "";
String sheetMoist = "";
String UpdatedStamp = "";
const char *host = "script.google.com";
const char *GScriptId = "AKfycbxnnEwAX4IMJpFgUQ-sycNawxCqtElGJC-s5yJhaAWv8XFBgqU_rEj0UYw1BocEY2au"; // Replace with your own google script id
const int httpsPort = 443;                                                                          // the https port is same

// echo | openssl s_client -connect script.google.com:443 |& openssl x509 -fingerprint -noout
const char *fingerprint = "";

// const uint8_t fingerprint[20] = {};

String url = String("/macros/s/") + GScriptId + "/exec?value=TimeStamp"; // Write Teperature to Google Spreadsheet at cell A1
// Fetch Google Calendar events for 1 week ahead
String url2 = String("/macros/s/") + GScriptId + "/exec?cal"; // Write to Cell A continuosly

// replace with sheet name not with spreadsheet file name taken from google
String payload_base = "{\"command\": \"appendRow\", \
                    \"sheet_name\": \"SensorSheet\", \
                       \"values\": ";
String payload = "";

HTTPSRedirect *client = nullptr;

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

int extractedValues[10]; // create an array to store the extracted values
uint8_t pos = 0;         // initialize the position to zero
uint8_t lastIndex = 0;   // initialize the index of the last comma to zero

uint8_t count = 0;
String values, uid;

bool message_started = false;
String received_message = ""; //<ID:DTH1 [BASE]: 0,1,5,81.91,30.62,88,1,0,98,0>
//<ID:DTH1 [WIFI]: 0,0,20,7,0>
String send_id = String("ID:") + "DTH1 [WIFI]: ";

String timeStamp = "";
uint8_t soilIndex, soilMoisture, soilStatus, soilBattery, valveIndex, valveStatus, valveBattery, valve_status, soilHumidity, soilTemperature, valveControl, highThreshold, lowThreshold;

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
  delay(2000);

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

void initSheets()
{
  // Use HTTPSRedirect class to create a new TLS connection
  client = new HTTPSRedirect(httpsPort);
  client->setInsecure();
  client->setPrintResponseBody(true);
  client->setContentTypeHeader("application/json");
  Serial.print("Connecting to ");
  Serial.println(host); // try to connect with "script.google.com"

  // Try to connect for a maximum of 5 times then exit
  bool flag = false;
  for (int i = 0; i < 5; i++)
  {
    int retval = client->connect(host, httpsPort);
    if (retval == 1)
    {
      flag = true;
      break;
    }
    else
      Serial.println("Connection failed. Retrying...");
  }

  if (!flag)
  {
    Serial.print("Could not connect to server: ");
    Serial.println(host);
    Serial.println("Exiting...");
    return;
  }
  // Finish setup() function in 1s since it will fire watchdog timer and will reset the chip.
  // So avoid too many requests in setup()

  Serial.println("\nWrite into cell 'A1'");
  Serial.println("------>");
  // fetch spreadsheet data
  client->GET(url, host);

  Serial.println("\nGET: Fetch Google Calendar Data:");
  Serial.println("------>");
  // fetch spreadsheet data
  client->GET(url2, host);

  Serial.println("\nStart Sending Sensor Data to Google Spreadsheet");

  // delete HTTPSRedirect object
  delete client;
  client = nullptr;
}
void setup()
{
  Serial.begin(9600);
  Serial.println("Serial Initialise!");
  delay(1000);

  timeClient.begin();
  delay(1000);

  initWiFi();
  firebaseAuth();

  initSheets();
}

void loop()
{
  if (Firebase.isTokenExpired())
  {
    Firebase.refreshToken(&config);
    Serial.println("Refresh token");
  }
}

void serialEvent()
{
  while (Serial.available() > 0)
  {
    char incoming_char = Serial.read();
    if (incoming_char == '<')
    { // Check if start character is received
      received_message = "";
      message_started = true;
    }

    if (message_started)
    {
      received_message += incoming_char;
      if (incoming_char == '>')
      { // Check if end character is received
        process_message(received_message);
        message_started = false;
      }
    }
  }
}

void process_message(String message)
{
  // Remove start and end characters
  message = message.substring(1, message.length() - 1);
  if (message.startsWith("ID:DTH1 [BASE]: "))
  { // check if the message is valid
    message.remove(0, 16); // remove the ID and protocol information from the message
  }

  Serial.println("Received message: " + message);

  pos = 0;       // reset the number of extracted values to zero
  lastIndex = 0; // initialize the index of the last comma to zero

  for (int i = 0; i < message.length() && pos < 10; i++)
  { // loop through the string
    if (message.charAt(i) == ',')
    { // if a comma is found
      extractedValues[pos++] = message.substring(lastIndex, i).toInt(); // extract the value and convert it to integer
      lastIndex = i + 1;                                                // set the index of the last comma to the next character after the comma
    }
  }
  extractedValues[pos++] = message.substring(lastIndex).toInt(); // extract the last value and convert it to integer

  soilIndex = extractedValues[1];
  soilMoisture = extractedValues[2];
  soilHumidity = extractedValues[3];
  soilTemperature = extractedValues[4];
  soilBattery = extractedValues[5];
  valveIndex = extractedValues[6];
  valveStatus = extractedValues[7];
  valveBattery = extractedValues[8];
  delay(50);

  if (valveStatus == 0)
  {
    updateTime(0); //Update Off-Time
    Firebase.setInt(fbdo, ("user/" + uid + "/actuator/Control"), 0);
  }
  else if (valveStatus == 1)
  {
    updateTime(1); //Update On-Time
  }

  updateFirebase();
  updateSheets();

  sendBase();
}

String realtime()
{
  timeClient.update();
  delay(500);
  time_t epochTime = timeClient.getEpochTime();
  int currentHour = timeClient.getHours();
  int currentMinute = timeClient.getMinutes();
  struct tm *ptm = gmtime((time_t *)&epochTime); // Get a time structure
  int monthDay = ptm->tm_mday;
  int currentMonth = ptm->tm_mon + 1;
  int currentYear = ptm->tm_year + 1900;

  String timeStamp = String(monthDay) + "/" + String(currentMonth) + "/" + String(currentYear) + " - " + String(currentHour) + ":" + String(currentMinute);
  return timeStamp;
}

void updateFirebase()
{
  timeClient.update();
  delay(500);

  timeStamp = (String)timeClient.getFormattedTime();

  Firebase.setInt(fbdo, ("user/" + uid + "/sensor/Index"), soilIndex);
  Firebase.setInt(fbdo, ("user/" + uid + "/sensor/Moisture"), soilMoisture);
  Firebase.setInt(fbdo, ("user/" + uid + "/sensor/Humidity"), soilHumidity);
  Firebase.setInt(fbdo, ("user/" + uid + "/sensor/Temperature"), soilTemperature);
  Firebase.setInt(fbdo, ("user/" + uid + "/sensor/Battery"), soilBattery);
  Firebase.setString(fbdo, ("user/" + uid + "/sensor/Timestamp"), realtime());

  Firebase.setInt(fbdo, ("user/" + uid + "/actuator/Index"), valveIndex);
  Firebase.setInt(fbdo, ("user/" + uid + "/actuator/Status"), valveStatus);
  Firebase.setInt(fbdo, ("user/" + uid + "/actuator/Battery"), valveBattery);

  if (Firebase.getInt(fbdo, ("user/" + uid + "/actuator/Control")))
  {
    valveControl = fbdo.intData();
  }
  if (Firebase.getInt(fbdo, ("user/" + uid + "/sensor/highThreshold")))
  {
    highThreshold = fbdo.intData();
  }
  if (Firebase.getInt(fbdo, ("user/" + uid + "/sensor/lowThreshold")))
  {
    lowThreshold = fbdo.intData();
  }

  delay(100);
}

void sendBase()
{
  //  String loraMessage = "<ID:DTH1 [WIFI]: 0,1,75,30,0>";
  String loraMessage = send_id + "0," + (String)valveControl + ',' + (String)highThreshold + ',' + (String)lowThreshold + ",0";
  Serial.flush(); // Wait for data to be fully transmitted
  Serial.println("<" + loraMessage + ">");
  Serial.flush(); // Wait for data to be fully transmitted
  delay(100);
}

void updateTime(int status_bit)
{
  timeClient.update();
  delay(500);

  String current_timeStamp = (String)timeClient.getFormattedTime();
  //  Serial.print("Current timestamp: "); Serial.println(current_timeStamp);
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
  delay(100);
}

void updateSheets()
{

  sheetHumid = String(soilMoisture) + String("%"); // convert integer humidity to string humidity
  sheetTemp = String(soilTemperature) + String("°C");
  sheetMoist = String(soilHumidity) + String("%");

  static int error_count = 0;
  static int connect_count = 0;
  const unsigned int MAX_CONNECT = 20;
  static bool flag = false;

  payload = payload_base + "\"" + realtime() + "," + sheetMoist + "," + sheetTemp + "," + sheetHumid + "\"}";

  if (!flag)
  {
    client = new HTTPSRedirect(httpsPort);
    client->setInsecure();
    flag = true;
    client->setPrintResponseBody(true);
    client->setContentTypeHeader("application/json");
  }

  if (client != nullptr)
  {
    if (!client->connected())
    {
      client->connect(host, httpsPort);
      client->POST(url2, host, payload, false);
      Serial.print("Sent : ");
      Serial.println("Temp and Humid");
    }
  }
  else
  {
    DPRINTLN("Error creating client object!");
    error_count = 5;
  }

  if (connect_count > MAX_CONNECT)
  {
    connect_count = 0;
    flag = false;
    delete client;
    return;
  }

  Serial.println("POST or SEND Sensor data to Google Spreadsheet:");
  if (client->POST(url2, host, payload))
  {
    ;
  }
  else
  {
    ++error_count;
    DPRINT("Error-count while connecting: ");
    DPRINTLN(error_count);
  }

  if (error_count > 3)
  {
    Serial.println("Halting processor...");
    delete client;
    client = nullptr;
    Serial.printf("Final free heap: %u\n", ESP.getFreeHeap());
    Serial.printf("Final stack: %u\n", ESP.getFreeContStack());
    Serial.flush();
    ESP.deepSleep(0);
  }
  delay(100); // keep delay of minimum 2 seconds as dht allow reading after 2 seconds interval and also for google sheet
}
