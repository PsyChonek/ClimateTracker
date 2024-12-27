# ClimateApi.ReadingsApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**allReadingsGet**](ReadingsApi.md#allReadingsGet) | **GET** /allReadings | Get all readings
[**newReadingPost**](ReadingsApi.md#newReadingPost) | **POST** /newReading | Add a new reading



## allReadingsGet

> [AllReadingsGet200ResponseInner] allReadingsGet(opts)

Get all readings

Retrieve all readings within a specific date range.

### Example

```javascript
import ClimateApi from 'climate_api';

let apiInstance = new ClimateApi.ReadingsApi();
let opts = {
  'fromDate': new Date("2013-10-20"), // Date | Start date for the range.
  'toDate': new Date("2013-10-20") // Date | End date for the range.
};
apiInstance.allReadingsGet(opts, (error, data, response) => {
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
 **fromDate** | **Date**| Start date for the range. | [optional] 
 **toDate** | **Date**| End date for the range. | [optional] 

### Return type

[**[AllReadingsGet200ResponseInner]**](AllReadingsGet200ResponseInner.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## newReadingPost

> NewReadingPost200Response newReadingPost(opts)

Add a new reading

Endpoint to add a new sensor reading to the database.

### Example

```javascript
import ClimateApi from 'climate_api';

let apiInstance = new ClimateApi.ReadingsApi();
let opts = {
  'body': new ClimateApi.NewReadingPostRequest() // NewReadingPostRequest | 
};
apiInstance.newReadingPost(opts, (error, data, response) => {
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
 **body** | [**NewReadingPostRequest**](NewReadingPostRequest.md)|  | [optional] 

### Return type

[**NewReadingPost200Response**](NewReadingPost200Response.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*

