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
#define echoPin 18  // Pin para el sensor de ultrasonido
#define trigPin 19  // Pin para el sensor de ultrasonido
#define DHTPIN1 15  // Pin para el DHT11
#define DHTPIN2 2   // Pin para el DHT22

String databasePath;
String tempPathDHT11;
String humPathDHT11;
String tempPathDHT22;
String humPathDHT22;
String ktcF;
String ktcC;

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
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print('.');
    delay(1000);
  }
  Serial.println(WiFi.localIP());
  Serial.println();
}

// Escribir valores flotantes en la base de datos
void sendFloat(String path, float value) {
  firebase.setFloat(path, value);
  Serial.print("Escribiendo valor: ");
  Serial.print(value);
  Serial.print(" en la ruta: ");
  Serial.println(path);
}

void setup() {
  Serial.begin(115200);
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  dht11.setup(DHTPIN1, DHTesp::DHT11);
  dht22.setup(DHTPIN2, DHTesp::DHT22);

  initWiFi();


  // Rutas en la base de datos para lecturas de sensores
  tempPathDHT11 = "/UsersData/eNKw9EvEK3gBq41dZjt6XwEYZjW2/temperatureDHT11";
  humPathDHT11 = "/UsersData/eNKw9EvEK3gBq41dZjt6XwEYZjW2/humidityDHT11";
  tempPathDHT22 = "/UsersData/eNKw9EvEK3gBq41dZjt6XwEYZjW2/temperatureDHT22";
  humPathDHT22 = "/UsersData/eNKw9EvEK3gBq41dZjt6XwEYZjW2/humidityDHT22";
  ktcF = "/UsersData/eNKw9EvEK3gBq41dZjt6XwEYZjW2/degreesF";
  ktcC = "/UsersData/eNKw9EvEK3gBq41dZjt6XwEYZjW2/degreesC";

  // Retardo pequeño para que el sensor se optimice
  delay(500); 
}

void loop() {
  // Lectura de sensor de ultrasonido
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  duration = pulseIn(echoPin, HIGH);
  distance = duration / 58.2;
  Serial.print("Distance: ");
  Serial.print(distance);
  Serial.println(" cm");

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

  // Enviar nuevas lecturas a la base de datos
  if (millis() - sendDataPrevMillis > timerDelay || sendDataPrevMillis == 0) {
    sendDataPrevMillis = millis();

    // Enviar lecturas a la base de datos



    
    sendFloat(tempPathDHT11, dataDHT11.temperature);
    sendFloat(humPathDHT11, dataDHT11.humidity);
    sendFloat(tempPathDHT22, dataDHT22.temperature);
    sendFloat(humPathDHT22, dataDHT22.humidity);
    sendFloat(ktcF, ktc.readFahrenheit());
    sendFloat(ktcC, ktc.readCelsius());
  }

  delay(5000); // Espera de 5 segundos entre cada lectura del sensor de ultrasonido
}
