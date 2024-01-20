#include <Arduino.h>
#include <DHT.h>
#include "SPIFFS.h"
#include <ESPAsyncWebServer.h>
#include <ArduinoJson.h>
#include "time.h"
#include <HTTPClient.h>

#define ssid "*********"
#define password "12341234"

#define DHTTYPE DHT11
#define DHTPIN 13

#define API_SERVER "http://192.168.0.106:9051"

AsyncWebServer server(80);
StaticJsonDocument<64> reading;
StaticJsonDocument<64> wifiStatus;

DHT dht(DHTPIN, DHTTYPE);

void connectToWifi();
void setUpTime();

String getValuesJSON(float temperature, float humidity, int timestamp);

String readReading();

void sendReading(String value);
void sendInfo();

void setup()
{
  Serial.begin(115200);
  dht.begin();
  connectToWifi();
  server.begin();
}

int readingInterval = 60000;
int readingCooldown = 0;

int infoInterval = 10000;
int infoCooldown = 0;

time_t now;
struct tm timeinfo;

void loop()
{
  if (millis() - readingCooldown >= readingInterval)
  {
    readingCooldown = millis();
    Serial.println("Sending readings");

    sendReading(readReading());
  }

  // if (millis() - wifiCooldown >= wifiInterval)
  // {
  //   wifiCooldown = millis();
  //   if (WiFi.status() != WL_CONNECTED)
  //   {
  //     connectToWifi();
  //   }
  //   else
  //   {
  //     Serial.print("IP Address: ");
  //     Serial.print(WiFi.localIP());
  //     Serial.print(" Uptime: ");
  //     Serial.println(millis() / 1000);

  //     sendWifiStatusEvent();
  //   }
  // }
}

void connectToWifi()
{
  WiFi.begin(ssid, password);
  Serial.println("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(1000);
    Serial.print(".");
  }
  Serial.println();
  Serial.println("Connected to the WiFi network");

  setUpTime();
}

String readReading()
{
  return getValuesJSON(dht.readTemperature(), dht.readHumidity(), time(&now));
}

// TODO
void sendInfo()
{
  String status = WiFi.status() == WL_CONNECTED ? "connected" : "disconnected";
  int wifiSignalStrength = WiFi.RSSI();

  wifiStatus["status"] = status;
  wifiStatus["wifiSignalStrength"] = wifiSignalStrength;

  String values;
  serializeJson(wifiStatus, values);
}

void sendReading(String value)
{
  Serial.println("making POST request");

  String path = "/newReading";
  String contentType = "application/json";

  HTTPClient http;

  Serial.println("[HTTP] [POST] [Server] " + String(API_SERVER) + path);

  http.begin(API_SERVER + path);
  http.addHeader("Content-Type", contentType);

  int statusCode = http.POST(value);
  Serial.print("Status code: ");
  Serial.println(statusCode);
}

// Send values to web page
String getValuesJSON(float temperature, float humidity, int timestamp = 0)
{
  if (isnan(temperature) || isnan(humidity))
  {
    Serial.println("Failed to read from DHT sensor!");
    return "";
  }

  // Return values in JSON
  reading["temperature"] = temperature;
  reading["humidity"] = humidity;
  reading["timestamp"] = timestamp;

  String values;
  serializeJson(reading, values);
  return values;
}

void setUpTime()
{
  // Set the system time using the network time protocol (NTP)
  configTime(0, 0, "pool.ntp.org", "time.nist.gov");

  Serial.println("Waiting for time sync...");
  time_t now;
  struct tm timeinfo;
  const int max_wait_time = 10;
  int wait_time = 0;

  // Wait for time to be set
  while (time(nullptr) < 1510644967)
  {
    delay(500);
    Serial.print(".");
    wait_time++;
    if (wait_time > max_wait_time)
    {
      Serial.println("Failed to obtain time. Check your network connection.");
      break;
    }
  }
  Serial.println();

  // Print the current time
  time(&now);
  localtime_r(&now, &timeinfo);
  Serial.println(asctime(&timeinfo));
}