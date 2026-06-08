import json
import queue
import threading
import time
from typing import Any, Dict, Optional

import requests
import serial

# ------------------ CONFIG ------------------
SERIAL_PORT = "COM5"          # Change
SERIAL_BAUD = 115200

API_KEY = "YOUR_FIREBASE_WEB_API_KEY"
EMAIL = "YOUR_FIREBASE_USER_EMAIL"
PASSWORD = "YOUR_FIREBASE_USER_PASSWORD"
DB_URL = "https://efarm-dashboard-default-rtdb.firebaseio.com"
UID = "5HIdbcbsoce04nfg9sPENa8qinI2"

SENSOR_PATH = f"user/{UID}/devices/sensor1"
VALVE_PATH = f"user/{UID}/devices/actuator1"

POLL_SECONDS = 1.0
# --------------------------------------------


def firebase_login(api_key: str, email: str, password: str) -> Dict[str, Any]:
  url = f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={api_key}"
  payload = {
    "email": email,
    "password": password,
    "returnSecureToken": True,
  }
  r = requests.post(url, json=payload, timeout=20)
  r.raise_for_status()
  return r.json()


class FirebaseRest:
  def __init__(self, db_url: str, id_token: str):
    self.db_url = db_url.rstrip("/")
    self.id_token = id_token

  def _url(self, path: str) -> str:
    path = path.strip("/")
    return f"{self.db_url}/{path}.json?auth={self.id_token}"

  def patch(self, path: str, data: Dict[str, Any]) -> None:
    r = requests.patch(self._url(path), json=data, timeout=20)
    r.raise_for_status()

  def get(self, path: str) -> Any:
    r = requests.get(self._url(path), timeout=20)
    r.raise_for_status()
    return r.json()


def make_data_line(kind: str, fields: Dict[str, Any]) -> str:
  parts = ["DATA", kind]
  for k, v in fields.items():
    parts.append(str(k))
    parts.append(str(v))
  return ",".join(parts)


def make_cmd_line(kind: str, fields: Dict[str, Any]) -> str:
  parts = ["CMD", kind]
  for k, v in fields.items():
    parts.append(str(k))
    parts.append(str(v))
  return ",".join(parts)


def parse_csv_tokens(line: str) -> list[str]:
  return [x.strip() for x in line.strip().split(",") if x.strip()]


def safe_int(v: Any, default: int = 0) -> int:
  try:
    return int(v)
  except Exception:
    return default


def safe_float(v: Any, default: float = 0.0) -> float:
  try:
    return float(v)
  except Exception:
    return default


class Bridge:
  def __init__(self, ser: serial.Serial, fb: FirebaseRest):
    self.ser = ser
    self.fb = fb
    self.stop = False
    self.tx_queue: "queue.Queue[str]" = queue.Queue()

    self.last_cmd_snapshot: Dict[str, Any] = {}

  def serial_writer(self) -> None:
    while not self.stop:
      try:
        line = self.tx_queue.get(timeout=0.2)
      except queue.Empty:
        continue
      self.ser.write((line + "\n").encode("utf-8"))
      self.ser.flush()

  def serial_reader(self) -> None:
    while not self.stop:
      raw = self.ser.readline().decode("utf-8", errors="ignore").strip()
      if not raw:
        continue

      print(f"[ESP] {raw}")

      # Optional: heartbeat mirrors to Firebase for visibility.
      if raw.startswith("HB,"):
        t = parse_csv_tokens(raw)
        if len(t) >= 6:
          self.fb.patch(f"user/{UID}/testBridge", {
            "heartbeatMs": safe_int(t[1]),
            "soilStatus": safe_int(t[2]),
            "valveStatus": safe_int(t[3]),
            "moistureThreshold": safe_int(t[4]),
            "valveThreshold": safe_int(t[5]),
            "updatedAt": int(time.time() * 1000),
          })

  def poll_firebase_commands(self) -> None:
    cmd_path = f"user/{UID}/testBridgeCommands"

    # Seed defaults once.
    self.fb.patch(cmd_path, {
      "sensor1": {"MoistureThreshold": 35, "status": 0},
      "actuator1": {"status": 0, "threshold": 50},
      "updatedAt": int(time.time() * 1000),
    })

    while not self.stop:
      try:
        data = self.fb.get(cmd_path) or {}
      except Exception as ex:
        print(f"[FB] poll error: {ex}")
        time.sleep(POLL_SECONDS)
        continue

      # Expect:
      # /user/{uid}/testBridgeCommands/sensor1/MoistureThreshold
      # /user/{uid}/testBridgeCommands/actuator1/status, threshold
      sensor = data.get("sensor1", {}) if isinstance(data, dict) else {}
      actuator = data.get("actuator1", {}) if isinstance(data, dict) else {}

      current = {
        "sensor1": {
          "MoistureThreshold": safe_int(sensor.get("MoistureThreshold", 35)),
          "status": safe_int(sensor.get("status", 0)),
        },
        "actuator1": {
          "status": safe_int(actuator.get("status", 0)),
          "threshold": safe_int(actuator.get("threshold", 50)),
        },
      }

      if current != self.last_cmd_snapshot:
        self.last_cmd_snapshot = current

        soil_cmd = make_cmd_line("SOIL", current["sensor1"])
        valve_cmd = make_cmd_line("VALVE", current["actuator1"])
        self.tx_queue.put(soil_cmd)
        self.tx_queue.put(valve_cmd)

        print(f"[FB->ESP] {soil_cmd}")
        print(f"[FB->ESP] {valve_cmd}")

      time.sleep(POLL_SECONDS)

  def cli_loop(self) -> None:
    help_text = (
      "\nCommands:\n"
      "  soil temp hum moist battery threshold status\n"
      "    ex: soil 31.2 58 43 92 35 1\n"
      "  valve status flow pressure threshold battery\n"
      "    ex: valve 1 22 45 50 90\n"
      "  quit\n"
    )
    print(help_text)

    while not self.stop:
      try:
        raw = input("bridge> ").strip()
      except (KeyboardInterrupt, EOFError):
        self.stop = True
        break

      if not raw:
        continue
      if raw.lower() == "quit":
        self.stop = True
        break

      parts = raw.split()
      kind = parts[0].lower()

      try:
        if kind == "soil" and len(parts) == 7:
          temp = safe_float(parts[1])
          hum = safe_int(parts[2])
          moist = safe_int(parts[3])
          battery = safe_int(parts[4])
          threshold = safe_int(parts[5])
          status = safe_int(parts[6])

          payload = {
            "type": "sensor",
            "Temperature": temp,
            "Humidity": hum,
            "Moisture": moist,
            "Battery": battery,
            "MoistureThreshold": threshold,
            "status": status,
            "Timestamp": int(time.time() * 1000),
          }
          self.fb.patch(SENSOR_PATH, payload)

          line = make_data_line("SOIL", payload)
          self.tx_queue.put(line)
          print(f"[LAPTOP->ESP] {line}")
          continue

        if kind == "valve" and len(parts) == 6:
          status = safe_int(parts[1])
          flow = safe_int(parts[2])
          pressure = safe_int(parts[3])
          threshold = safe_int(parts[4])
          battery = safe_int(parts[5])

          payload = {
            "type": "actuator",
            "status": status,
            "flow": flow,
            "pressure": pressure,
            "threshold": threshold,
            "Battery": battery,
            "Timestamp": int(time.time() * 1000),
          }
          self.fb.patch(VALVE_PATH, payload)

          line = make_data_line("VALVE", payload)
          self.tx_queue.put(line)
          print(f"[LAPTOP->ESP] {line}")
          continue

      except Exception as ex:
        print(f"[ERR] {ex}")
        continue

      print("Invalid command.")
      print(help_text)


def main() -> None:
  login = firebase_login(API_KEY, EMAIL, PASSWORD)
  token = login["idToken"]
  fb = FirebaseRest(DB_URL, token)

  ser = serial.Serial(SERIAL_PORT, SERIAL_BAUD, timeout=0.5)
  time.sleep(1.0)

  bridge = Bridge(ser, fb)

  threads = [
    threading.Thread(target=bridge.serial_writer, daemon=True),
    threading.Thread(target=bridge.serial_reader, daemon=True),
    threading.Thread(target=bridge.poll_firebase_commands, daemon=True),
  ]
  for t in threads:
    t.start()

  bridge.cli_loop()
  bridge.stop = True
  time.sleep(0.5)
  ser.close()


if __name__ == "__main__":
  main()
