//Set sleep time, when value is 1 almost sleep 8s,when value is 450, almost 1 hour.
#define SLEEP_CYCLE 2 // 450

//Set Lora frequency
#define FREQUENCY 868.0 // 868.0 // 915.0

//SX1278::begin(434.0, 125.0, 9, 7, SX127X_SYNC_WORD, 10, 8, 0);
#define BANDWIDTH 125.0
#define SPREADING_FACTOR 9
#define CODING_RATE 7
#define SX127X_SYNC_WORD 0x12
#define OUTPUT_POWER 20
#define PREAMBLE_LEN 8
#define GAIN 0

//328p
#define DIO0 2
#define DIO1 6

#define LORA_RST 4
#define LORA_CS 10

#define SPI_MOSI 11
#define SPI_MISO 12
#define SPI_SCK 13

//pin set
#define VOLTAGE_PIN A3 // Read battery voltage
#define PWM_OUT_PIN 9 // 2MHz pwm_out
#define SENSOR_POWER_PIN 5 // RF98 Power pin
#define ADC_PIN A2 // Read moisture pin

#define SERIAL_ENABLE 1

SX1278 radio = new Module(LORA_CS, DIO0, LORA_RST, DIO1);
