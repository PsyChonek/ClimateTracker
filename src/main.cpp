#include <Arduino.h>
#include <DHT.h>
#include "SPIFFS.h"
#include <ESPAsyncWebServer.h>
#include <ArduinoJson.h>
#include "time.h"
#include "soc/rtc_wdt.h"

#define ssid "*********"
#define password "12341234"

#define DHTTYPE DHT11
#define DHTPIN 13

#define CHUNK_SIZE 75

AsyncWebServer server(80);
AsyncEventSource events("/events");
StaticJsonDocument<64> reading;
StaticJsonDocument<64> wifiStatus;

DHT dht(DHTPIN, DHTTYPE);

void connectToWifi();
void setupWebPages();
void setUpTime();

void storeReading(float temperature, float humidity, int timestamp);
String getValuesJSON(float temperature, float humidity, int timestamp);

void sendWifiStatusEvent();
void sendReadingEvent(float temperature, float humidity, int timestamp);

void sendAllReadings();

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

time_t now;
struct tm timeinfo;

void loop()
{
  if (millis() - readingCooldown >= readingInterval)
  {
    readingCooldown = millis();
    Serial.println("Sending readings");
    sendReadingEvent(dht.readTemperature(), dht.readHumidity(), time(&now));
    storeReading(dht.readTemperature(), dht.readHumidity(), time(&now));
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
    }
    else
    {
      Serial.printf("New client connected!\n");
    }
      sendWifiStatusEvent();
      sendAllReadings(); });

  server.addHandler(&events);
}

void sendAllReadings()
{
  rtc_wdt_disable();        // Disables the wdt service
  // Open file for reading
  File file = SPIFFS.open("/readings.txt");

  if (!file)
  {
    Serial.println("There was an error opening the file for reading");
    return;
  }

  Serial.println("Reading from file");
  String values = "{\"data\": [";
  int chunkIndex = 0;

  // For each line in the file
  while (file.available())
  {
    // Read the line
    String line = file.readStringUntil('\n');

    values += line;
    chunkIndex++;

    if (chunkIndex == CHUNK_SIZE)
    {
      values += "]}";

      events.send(values.c_str(), "allReadings", millis());
      values = "{\"data\": [";
      chunkIndex = 0;
      delay(5);
    }
    else if (file.available())
    {
      values += ",";
    }
  }

  values += "]}";

  events.send(values.c_str(), "allReadings", millis());

  // Close the file
  file.close();
  rtc_wdt_enable();         // Enables the wdt service
}

void sendReadingEvent(float temperature, float humidity, int timestamp)
{
  events.send(getValuesJSON(temperature, humidity, timestamp).c_str(), "newReading", millis());
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

void storeReading(float temperature, float humidity, int timestamp)
{
  Serial.println("Storing readings");

  // Open file for writing
  File file = SPIFFS.open("/readings.txt", FILE_APPEND);

  if (!file)
  {
    Serial.println("There was an error opening the file for writing");
    return;
  }

  Serial.println("Writing to file");

  String row = "{\"temperature\": " + String(temperature) + ", \"humidity\": " + String(humidity) + ", \"timestamp\": " + String(timestamp) + "}";
  Serial.println(row);

  // Append readings to file
  file.println(row);

  // Close the file
  file.close();

  Serial.println("Reading stored");
}