#include <Arduino.h>
#include <WiFi.h>
#include <ESP32Firebase.h>
#include <Wire.h>
#include "DHTesp.h"
#include "max6675.h"

// Define tus credenciales WiFi y Firebase
#define WIFI_SSID "nombre de tu red"
#define WIFI_PASSWORD "clave de tu resd"
#define REFERENCE_URL "***************" // url de referencia para la base de datos firebase


Firebase firebase(REFERENCE_URL);

// Definición de pines para sensores
// #define echoPin 18  // Pin para el sensor de ultrasonido
// #define trigPin 19  // Pin para el sensor de ultrasonido
#define DHTPIN1 15  // Pin para el DHT11
#define DHTPIN2 2   // Pin para el DHT22
#define RELAY_PIN 4 // pin para el relay que enciende la celda peltier

String databasePathD2;
String tempPathDHT11D2;
String humPathDHT11D2;
String tempPathDHT22D2;
String humPathDHT22D2;
String ktcFD2;
String ktcCD2;

int ktcs0 = 23; 
int ktcCS = 22; 
int ktcCLK = 21; 
MAX6675 ktc(ktcCLK, ktcCS, ktcs0);

// Variables para temporización (enviar nuevas lecturas cada tres minutos)
unsigned long sendDataPrevMillis = 0;
unsigned long timerDelay = 2000;

long duration, distance;
DHTesp dht11;
DHTesp dht22;

// Inicializa WiFi
void initWiFi() {
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to WiFi ..");
  
  unsigned long startAttemptTime = millis();
  
  while (WiFi.status() != WL_CONNECTED && millis() - startAttemptTime < 20000) {
    Serial.print('.');
    delay(1000);
  }
  
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("Connected to WiFi");
    Serial.println(WiFi.localIP());
    Serial.println();
  } else {
    Serial.println("Failed to connect to WiFi");
  }
}

// Escribir valores flotantes en la base de datos
void sendFloat(String path, float value) {
  if (WiFi.status() == WL_CONNECTED) {
    firebase.setFloat(path, value);
    Serial.print("Escribiendo valor: ");
    Serial.print(value);
    Serial.print(" en la ruta: ");
    Serial.println(path);
  } else {
    Serial.println("No se pudo enviar a Firebase, no conectado a WiFi");
  }
}

void setup() {
  Serial.begin(115200);
  dht11.setup(DHTPIN1, DHTesp::DHT11);
  dht22.setup(DHTPIN2, DHTesp::DHT11);
  // Inicializar el pin del relé como salida
  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, HIGH);
  
  initWiFi();

  // Rutas en la base de datos para lecturas de sensores
  tempPathDHT11D2 = "/UsersData/eNKw9EvEK3gBq41dZjt6XwEYZjW2/temperatureDHT11D2";
  humPathDHT11D2 = "/UsersData/eNKw9EvEK3gBq41dZjt6XwEYZjW2/humidityDHT11D2";
  tempPathDHT22D2 = "/UsersData/eNKw9EvEK3gBq41dZjt6XwEYZjW2/temperatureDHT22D2";
  humPathDHT22D2 = "/UsersData/eNKw9EvEK3gBq41dZjt6XwEYZjW2/humidityDHT22D2";
  ktcFD2 = "/UsersData/eNKw9EvEK3gBq41dZjt6XwEYZjW2/degreesFD2";
  ktcCD2 = "/UsersData/eNKw9EvEK3gBq41dZjt6XwEYZjW2/degreesCD2";

  // Retardo pequeño para que el sensor se optimice
  delay(500); 
}

void loop() {

  // Obtención de datos de sensores DHT11 y DHT22
  TempAndHumidity dataDHT11 = dht11.getTempAndHumidity();
  TempAndHumidity dataDHT22 = dht22.getTempAndHumidity();

  // Mostrar datos de sensores en el monitor serial
  Serial.println("Sensor DHT11:");
  Serial.println("Temperatura: " + String(dataDHT11.temperature, 2) + "°C");
  Serial.println("Humedad: " + String(dataDHT11.humidity, 1) + "%");
  Serial.println("---");
  
  Serial.println("Sensor DHT22:");
  Serial.println("Temperatura: " + String(dataDHT22.temperature, 2) + "°C");
  Serial.println("Humedad: " + String(dataDHT22.humidity, 1) + "%");
  Serial.println("---");

  // Lecturas del sensor de temperatura K-Type
  Serial.print("Grados C°: "); 
  Serial.print(ktc.readCelsius());
  Serial.print("\t Grados F°: "); 
  Serial.println(ktc.readFahrenheit()); 

  // Activar o desactivar la celda peltier
  if (dataDHT11.temperature > 45) { 
    digitalWrite(RELAY_PIN, HIGH);
  } else {
    digitalWrite(RELAY_PIN, LOW);
  }

  // Enviar nuevas lecturas a la base de datos
  if (millis() - sendDataPrevMillis > timerDelay || sendDataPrevMillis == 0) {
    sendDataPrevMillis = millis();

    // Enviar lecturas a la base de datos
    sendFloat(tempPathDHT11D2, dataDHT11.temperature);
    sendFloat(humPathDHT11D2, dataDHT11.humidity);
    sendFloat(tempPathDHT22D2, dataDHT22.temperature);
    sendFloat(humPathDHT22D2, dataDHT22.humidity);
    sendFloat(ktcFD2, ktc.readFahrenheit());
    sendFloat(ktcCD2, ktc.readCelsius());
  }

  delay(5000); // Espera de 5 segundos entre cada lectura del sensor de ultrasonido
}
