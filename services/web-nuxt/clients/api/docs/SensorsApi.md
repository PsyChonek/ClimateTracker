# ClimateApi.SensorsApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**addSensorPost**](SensorsApi.md#addSensorPost) | **POST** /addSensor | Add a new sensor
[**allSensorsGet**](SensorsApi.md#allSensorsGet) | **GET** /allSensors | Get all sensors
[**sensorPatch**](SensorsApi.md#sensorPatch) | **PATCH** /sensor | Update sensor information



## addSensorPost

> AddSensorPost200Response addSensorPost(opts)

Add a new sensor

Add a new sensor to the database with its IP and port.

### Example

```javascript
import ClimateApi from 'climate_api';

let apiInstance = new ClimateApi.SensorsApi();
let opts = {
  'body': new ClimateApi.AddSensorPostRequest() // AddSensorPostRequest | 
};
apiInstance.addSensorPost(opts, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | [**AddSensorPostRequest**](AddSensorPostRequest.md)|  | [optional] 

### Return type

[**AddSensorPost200Response**](AddSensorPost200Response.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## allSensorsGet

> [AllSensorsGet200ResponseInner] allSensorsGet()

Get all sensors

Retrieve all sensors stored in the database.

### Example

```javascript
import ClimateApi from 'climate_api';

let apiInstance = new ClimateApi.SensorsApi();
apiInstance.allSensorsGet((error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**[AllSensorsGet200ResponseInner]**](AllSensorsGet200ResponseInner.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## sensorPatch

> SensorPatch200Response sensorPatch(opts)

Update sensor information

Update the display name and offsets for a sensor.

### Example

```javascript
import ClimateApi from 'climate_api';

let apiInstance = new ClimateApi.SensorsApi();
let opts = {
  'body': new ClimateApi.SensorPatchRequest() // SensorPatchRequest | 
};
apiInstance.sensorPatch(opts, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | [**SensorPatchRequest**](SensorPatchRequest.md)|  | [optional] 

### Return type

[**SensorPatch200Response**](SensorPatch200Response.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*

