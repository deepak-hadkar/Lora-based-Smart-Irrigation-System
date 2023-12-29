int datarateValue = 0; // Data rate of SX1278 in bps
int done_flag = 0;

int ADC_O_1; // ADC Output First 8 bits
int ADC_O_2; // ADC Output Next 2 bits

int dry_value = 880;
int wet_value = 470;
byte moisture = 0;

// Send-Receive LoRa strings
byte soilIndex, soilMoisture, soilStatus, soilBattery, valveIndex, valveStatus, valveBattery, valve_status, valveControl = 0;
byte highThreshold = 70;
byte lowThreshold = 30;
float soilHumidity, soilTemperature;

const byte MAX_VALUES = 10;       // set the maximum number of values to extract
int extractedValues[MAX_VALUES]; // create an array to store the extracted values
byte pos = 0;                 // initialize the position to zero
byte lastIndex = 0;           // initialize the index of the last comma to zero

String send_id = String("ID:") + "DTH1 [VALVE]: "; // ID:DHT1 [VALVE]:
