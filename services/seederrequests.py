import requests
import random
from datetime import datetime, timedelta

# Function to generate random sensor data
def generate_sensor_data(sensor_id, prev_temp=None, prev_humid=None):
    if prev_temp is not None and prev_humid is not None:
        temperature = round(random.uniform(max(-10.0, prev_temp - 2), min(40.0, prev_temp + 2)), 2)
        humidity = round(random.uniform(max(20.0, prev_humid - 2), min(100.0, prev_humid + 2)), 2)
    else:
        temperature = round(random.uniform(-10.0, 40.0), 2)  # Random temperature between -10 and 40
        humidity = round(random.uniform(20.0, 100.0), 2)  # Random humidity between 20% and 100%
    
    return {
        "sensorID": sensor_id,
        "temperature": temperature,
        "humidity": humidity
    }

# Function to send API request
def send_reading(sensor_data, api_ip):
    url = f"http://{api_ip}/newReading"
    response = requests.post(url, json=sensor_data)
    if response.status_code == 200:
        print(f"Successfully sent reading: {sensor_data}")
    else:
        print(f"Failed to send reading: {response.status_code} - {response.text}")

# Main function to generate and send readings
def generate_readings(from_date, to_date, per_day, sensor_id, api_ip):
    current_date = from_date
    prev_temp, prev_humid = None, None
    
    while current_date <= to_date:
        for _ in range(per_day):
            sensor_data = generate_sensor_data(sensor_id, prev_temp, prev_humid)
            
            # Generate a timestamp with a random time during the current day
            random_time = current_date.replace(hour=random.randint(0, 23), 
                                               minute=random.randint(0, 59), 
                                               second=random.randint(0, 59), 
                                               microsecond=random.randint(0, 999999))
            sensor_data["timestamp"] = random_time.strftime("%Y-%m-%dT%H:%M:%S.%f")[:-3] + "Z"
            
            # Send the reading
            send_reading(sensor_data, api_ip)
            
            # Update previous temperature and humidity
            prev_temp = sensor_data["temperature"]
            prev_humid = sensor_data["humidity"]
        
        current_date += timedelta(days=1)

if __name__ == "__main__":
    fromDate = datetime.now() - timedelta(days=7)
    toDate = datetime.now()
    perDay = 100
    sensorID = "sensor-006"
    apiIP = "localhost:9051"  # Replace with your actual API IP
    
    generate_readings(fromDate, toDate, perDay, sensorID, apiIP)