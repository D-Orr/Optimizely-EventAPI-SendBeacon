window.optly = window.optly || [];
window.optly.beacon = window.optly.beacon || [];

//Insert dns prefetch for the Optimizely event endpoint
var link = document.createElement('link');
link.rel = 'dns-prefetch';
link.href = 'https://logx.optimizely.com/v1/events';
document.head.appendChild(link);

var activated = function(){
    //Store common variables
    window.optly.beacon.accountId = window.optimizely.get('data').accountId;
    window.optly.beacon.visitorId = window.optimizely.get('visitor').visitorId;
    window.optly.beacon.eventIds = {};

    //Used to look an event name's ID
    window.optly.beacon.getEventIds = function(){
        var optlyEvents = optimizely.get('data').events;
        window.eventIds = {};
        for (i in optlyEvents){
            var apiName = optlyEvents[i].apiName;
            var id = optlyEvents[i].id;
            //window.optly.beacon.eventIds[apiName] = id;
            window.optly.beacon.eventIds[apiName] = id;
        }
    };
    
    window.optly.beacon.getEventIds();
    //GUID generator
    //https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
    window.optly.beacon.guid = function(){
            function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
            }
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    };

    window.optly.beacon.payloadBuilder = function(eventName){
        var eventId = window.optly.beacon.eventIds[eventName];
        var eventName = eventName;
        console.log('payloadvariables function: ' + eventName + ' and id ' +eventId);
        var currentTime = Date.now();
        var newUUID = window.optly.beacon.guid();
        var eventPayload = {
            "account_id": window.optly.beacon.accountId,
            "visitors": [
                {
                    "snapshots": [
                        {
                            "decisions": [
                                ],
                            "events": [
                                {
                                    "key": eventName,
                                    "entity_id": eventId,
                                    "timestamp": currentTime,
                                    "uuid": newUUID
                                }
                            ]
                        }
                    ],
                    "session_id": "AUTO",
                    "visitor_id": window.optly.beacon.visitorId
                }
            ],
            "anonymize_ip": true,
            "client_name": "sendBeacon",
            "client_version": "0.1"
        };
        return eventPayload;
    };

    //Send event api using sendBeacon
    window.optly.beacon.sendEvent = function(eventName){
        // if (eventId !== undefined){
            //Check to see if the eventName has an event ID.
            console.log("Sending " + eventName + " to Optimizely");
            var payloadData = JSON.stringify(window.optly.beacon.payloadBuilder(eventName));
            return navigator.sendBeacon('https://logx.optimizely.com/v1/events', payloadData);
        // }
        // else if (eventId == undefined){
        //     console.log("event ID is undefined for event name: " + eventNamee);
        // }    
    };
    
};



//Calls the sendbeacon function when Optimizely's data is available. 
window["optimizely"] = window["optimizely"] || [];
window["optimizely"].push({
  type: "addListener",
  filter: {
    type: "lifecycle",
    name: "activated"
  },
  // Add the initialized function as a handler.
  handler: activated
});