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

#define API_SERVER "http://192.168.0.110:9051"

AsyncWebServer server(80);
StaticJsonDocument<64> reading;
StaticJsonDocument<64> status;

DHT dht(DHTPIN, DHTTYPE);

// Variable espID to store the sensor ID
String espID;

void connectToWifi();
void setUpTime();

String getValuesJSON(float temperature, float humidity, String espID);

String readReading();

void sendReading(String value);
void sendInfo();

void setup()
{
  Serial.begin(115200);
  dht.begin();
  connectToWifi();
  server.begin();

  // Generate a random espID and store it in the SPIFFS file system if already exists read it
  if (!SPIFFS.begin(true))
  {
    Serial.println("An Error has occurred while mounting SPIFFS");
  }
  else
  {
    File file = SPIFFS.open("/espID.txt", "r");

    while (espID == "")
    {
      if (!file)
      {
        Serial.println("Failed to open file for reading");

        file = SPIFFS.open("/espID.txt", "w");
        if (!file)
        {
          Serial.println("Failed to open file for writing");
        }
        else
        {
          espID = String(random(1000, 9999));
          file.print(espID);
        }
      }

      espID = file.readString();
      if (espID == "")
      {
        file.close();
        file = SPIFFS.open("/espID.txt", "w");
        if (!file)
        {
          Serial.println("Failed to open file for writing");
        }
        else
        {
          espID = String(random(1000, 9999));
          file.print(espID);
        }
      }
    }

    Serial.println("Esp ID: " + espID);

    file.close();
  }

  sendInfo();
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
  return getValuesJSON(dht.readTemperature(), dht.readHumidity(), espID);
}

void sendInfo()
{
  status["espID"] = espID;
  status["ip"] = WiFi.localIP().toString();

  String values;
  serializeJson(status, values);

  Serial.println("making POST request");

  String path = "/addSensor";

  HTTPClient http;

  Serial.println("[HTTP] [POST] [Server] " + String(API_SERVER) + path);

  http.begin(API_SERVER + path);
  http.addHeader("Content-Type", "application/json");

  int statusCode = http.POST(values);
  Serial.print("Status code: ");
  Serial.println(statusCode);
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
String getValuesJSON(float temperature, float humidity, String espID = "")
{
  if (isnan(temperature) || isnan(humidity))
  {
    Serial.println("Failed to read from DHT sensor!");
    return "";
  }

  // Return values in JSON
  reading["temperature"] = temperature;
  reading["humidity"] = humidity;
  reading["espID"] = espID;

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
      Serial.println("");
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