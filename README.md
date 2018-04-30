# Optimizely-EventAPI-SendBeacon

Send events using the sendBeacon API. Utilizes Optimzely's event api. 

Sends the following payload to Optimizely:
* Account ID
* Event Name as key
* Event ID as entity ID

## Usage

```window.optly.sendBeacon.sendEvent('eventName');```

## Reference

Optimizely's Event API: https://developers.optimizely.com/x/events/api/
SendBeacon API: https://developer.mozilla.org/en-US/docs/Web/API/Navigator/sendBeacon
