#define SLEEP_CYCLE 2 // 450

// Set Lora frequency
#define FREQUENCY 434.0 // 434.0 // 915.0

// Unique antenna spec.(Must be same for trans-receive)
#define BANDWIDTH 125.0
#define SPREADING_FACTOR 9
#define CODING_RATE 7
#define SX127X_SYNC_WORD 0x12
#define OUTPUT_POWER 20
#define PREAMBLE_LEN 8
#define GAIN 0

// 328p
#define DIO0 2
#define DIO1 6

#define LORA_RST 4
#define LORA_CS 10

#define SPI_MOSI 11
#define SPI_MISO 12
#define SPI_SCK 13

#define VOLTAGE_PIN A0 // Read battery voltage

#define IN1 3
#define IN2 5
#define PUMP_PIN A1 // Relay for Pump

#define SERIAL_ENABLE 1
