#include <Arduino.h>
#include <DHT.h>
#include "SPIFFS.h"
#include <ESPAsyncWebServer.h>
#include <ArduinoJson.h>
#include "time.h"

#define ssid "*********"
#define password "12341234"

#define DHTTYPE DHT11
#define DHTPIN 13

AsyncWebServer server(80);
AsyncEventSource events("/events");
StaticJsonDocument<256> readings;
StaticJsonDocument<256> wifiStatus;

DHT dht(DHTPIN, DHTTYPE);

void connectToWifi();
void setupWebPages();
String getValuesJSON();
void sendReadingEvent();
void setUpTime();
void sendWifiStatusEvent();

void setup()
{
  Serial.begin(115200);
  dht.begin();

  if (!SPIFFS.begin(true))
  {
    Serial.println("An Error has occurred while mounting SPIFFS");
    return;
  }

  connectToWifi();
  setupWebPages();
  server.begin();
  Serial.println("HTTP server started");
}

int readingInterval = 60000;
int readingCooldown = 0;

int wifiInterval = 10000;
int wifiCooldown = 0;

void loop()
{
  if (millis() - readingCooldown >= readingInterval)
  {
    readingCooldown = millis();
    Serial.println("Sending readings");
    sendReadingEvent();
  }

  if (millis() - wifiCooldown >= wifiInterval)
  {
    wifiCooldown = millis();
    if (WiFi.status() != WL_CONNECTED)
    {
      connectToWifi();
    }
    else
    {
      Serial.print("IP Address: ");
      Serial.print(WiFi.localIP());
      Serial.print(" Uptime: ");
      Serial.println(millis() / 1000);

      sendWifiStatusEvent();
    }
  }
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

void setupWebPages()
{
  server.serveStatic("/", SPIFFS, "/");

  server.on("/", HTTP_GET, [](AsyncWebServerRequest *request)
            { request->send(SPIFFS, "/index.html", "text/html"); });

  server.onNotFound([](AsyncWebServerRequest *request)
                    { request->send(404, "text/plain", "Not found"); });

  events.onConnect([](AsyncEventSourceClient *client)
                   {
    if (client->lastId())
    {
      Serial.printf("Client reconnected! Last message ID that it got is: %u\n", client->lastId());
    } });

  server.addHandler(&events);
}

void sendReadingEvent()
{
  events.send(getValuesJSON().c_str(), "newReadings", millis());
}

void sendWifiStatusEvent()
{
  String status = WiFi.status() == WL_CONNECTED ? "connected" : "disconnected";
  int wifiSignalStrength = WiFi.RSSI();

  wifiStatus["status"] = status;
  wifiStatus["wifiSignalStrength"] = wifiSignalStrength;

  String values;
  serializeJson(wifiStatus, values);

  events.send(values.c_str(), "newWifiStatus", millis());
}

// Send values to web page
String getValuesJSON()
{
  float temperature = dht.readTemperature();
  float humidity = dht.readHumidity();

  // Return values in JSON
  readings["temperature"] = temperature;
  readings["humidity"] = humidity;

  String values;
  serializeJson(readings, values);
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