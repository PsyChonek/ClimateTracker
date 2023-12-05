# Readme

## Before you start

This is not nice project, it is bloated and not well written. I am not proud of it, but it works.

## Description

This project is simple app for EPS to monitor humidity and temperature in the room. It is html server with javascript, data is stored in file and can be downloaded, website is responsive and can be used on mobile devices.

## How to use

### Requirements

- EPS32
- Humidity and temperature sensor (DHT11, DHT22, AM2302, AM2321, AM2320, RHT03, Si7021, HTU21D, SHT21)

### Setup

1. Clone this repository
2. Install [PlatformIO](https://platformio.org/)
3. Connect your ESP32 to computer
4. Open this project in PlatformIO
5. Change `ssid` and `password` in `src/main.cpp` to your wifi credentials
6. Change `sensorType` in `src/main.cpp` to your sensor type
7. Upload project to ESP32
8. Upload File System image to ESP32
9. Reserve IP address for ESP32 in your router
10. Set up local DNS to redirect `eps.local` to IP address of ESP32
11. Open `eps.local` in your browser
12. Enjoy

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
