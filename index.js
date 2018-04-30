window.optly = window.optly || [];
window.optly.sendBeacon = window.optly.sendBeacon || [];

//Insert dns prefetch for the Optimizely event endpoint
var link = document.createElement('link');
link.rel = 'dns-prefetch';
link.href = 'https://logx.optimizely.com/v1/events';
document.head.appendChild(link);

var activate = function(){

    //Store common variables
    sendBeacon = window.optly.sendBeacon;
    sendBeacon.accountId = window.optimizely.get('data').accountId;
    sendBeacon.visitorId = window.optimizely.get('visitor').visitorId;
   
    //Used to look an event name's ID
    sendBeacon.getEventIds = function(){
        var optlyEvents = optimizely.get('data').events;
        window.eventIds = {};
        for (i in optlyEvents){
            var apiName = optlyEvents[i].apiName;
            var id = optlyEvents[i].id;
            sendBeacon.eventIds[apiName] = id;
        }
    }

    //GUID generator
    sendBeacon.guid = function(){
            function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
            }
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    };

    //retreive variables
    sendBeacon.payloadVariables = function(e){
        console.log(e);

        return {eventName: eventName, eventId:eventId,currentTime:currentTime, newUUID:newUUID};
    };

    sendBeacon.eventBuilder = function(eventName){
        var eventId = sendBeacon.eventIds[eventName];
        var eventName = eventName;
        console.log('payloadvariables function: ' + eventName + ' and id ' +eventId);
        var currentTime = Date.now();
        var newUUID = sendBeacon.guid();
        var eventPayload = {
            "account_id": sendBeacon.accountId,
            "visitors": [
                {
                    "snapshots": [
                        {
                            "decisions": [
                                ],
                            "events": [
                                {
                                    "key": eventVars.eventName,
                                    "entity_id": eventVars.eventId,
                                    "timestamp": eventVars.currentTime,
                                    "uuid": eventVars.newUUID
                                }
                            ]
                        }
                    ],
                    "session_id": "AUTO",
                    "visitor_id": window.optly.sendBeacon.visitorId
                }
            ],
            "anonymize_ip": true,
            "client_name": "sendBeacon-eventemitter",
            "client_version": "0.1"
        };
        return eventPayload;
    };

    //Send event api using sendBeacon
    window.optly.sendBeacon.sendEvent = function(eventName){
        // if (eventId !== undefined){
            //Check to see if the eventName has an event ID.
            console.log("Sending " + eventName + " to Optimizely");
            var payloadData = JSON.stringify(window.optly.sendBeacon.payloadVariables(eventName));
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