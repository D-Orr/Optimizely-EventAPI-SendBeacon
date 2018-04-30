# Optimizely-EventAPI-SendBeacon

**Compatibility**
Tested on Edge, Chrome, Safari Mobile and Firefox(Pre-Quantum). Does not work on Firefox Quantum.


**Description**

Send events using a browser's sendBeacon API and Optimzely's event api. 

Sends the following payload to Optimizely:
* Account ID
* Event Name as key
* Event ID as entity ID
* Sets Session_ID to AUTO in order to omit the decisions from the event payload.
* Timestamp in milliseconds.

Optimizely will attribute these events to an experiment as long as the event is sent > 30 minutes after the last network call sent by the Optimizely client JS.

## Purpose

To solve the issue where some click goals on links that leads visitors to a new domain are dropped.

The image below contains 3 events. The 1st one is sent using this API and the other 2 are sent using Optimizely's built in click tracking. 

[Image of Chrome's network panel]
(https://dorrvid.github.com/issue.jpg)

## Usage

1. Copy index.js and paste it in project JS. You can remove lines 5 through 8 if you already implemented the preconnect tag.
2. Send events using ```window.optly.beacon.sendEvent('myEventName');```

For example: 

```
$(document).delegate('a','mousedown',function(){
    window.optly.beacon.sendEvent('myEventName');
});
```

## Issues

* Optimizely will automatically save an event in local storage if an event does not successfully get sent. This allows events to be sent at a later time as long as the visitor comes back to the site.
* sendBeacon API does not work with Firefox Quantum.

## Reference

Optimizely's Event API: https://developers.optimizely.com/x/events/api/  
SendBeacon API: https://developer.mozilla.org/en-US/docs/Web/API/Navigator/sendBeacon  
W3 sendBeacon specs: https://www.w3.org/TR/beacon/  
UUID: https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript  
