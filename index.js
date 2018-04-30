window.optly = window.optly || [];
window.optly.sendBeacon = window.optly.sendBeacon || [];
window.optly.sendBeacon.accountId = window.optimizely.get('data').accountId;
window.optly.sendBeacon.visitorId = window.optimizely.get('visitor').visitorId;
//Used to look an event name's ID

try{
    var optlyEvents = optimizely.get('data').events;
    window.eventIds = {};
    for (i in optlyEvents){
        var apiName = optlyEvents[i].apiName;
        var id = optlyEvents[i].id;
        window.eventIds[apiName] = id;
        console.log(id);
    }
    console.log('returning event ids');
}
catch(e){
    console.log('error saving event IDs ' +e);
}

//GUID generator
window.optly.sendBeacon.guid = function(){
        function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
};

//retreive variables
window.optly.sendBeacon.payloadVariables = function(e){
    var eventName = e;
    var eventId = window.eventIds[eventName];
    console.log('payloadvariables function: ' + eventName + ' and id ' +eventId);
    var currentTime = Date.now();
    var newUUID = window.optly.sendBeacon.guid();
    return {eventName: eventName, eventId:eventId,currentTime:currentTime, newUUID:newUUID};
};

window.optly.sendBeacon.eventBuilder = function(eventVars){
    var eventPayload = {
        "account_id": window.optly.sendBeacon.accountId,
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



window.optly.sendBeacon.payloadBuilder = function(eventName){
    // console.log('payload builder');
    // console.log(window.optly.sendBeacon.payloadVariables(event));
    // var payloadData = window.optly.sendBeacon.payloadVariables(event);
    // return window.optly.sendBeacon.eventBuilder(payloadData);
};

//Builds the payload for the eventAPI

//Send event api using sendBeacon
window.optly.sendBeacon.sendEvent = function(eventName){
    // if (eventId !== undefined){
        //Check to see if the eventName has an event ID.
        console.log("Sending " + eventName + " to Optimizely");
        console.log('payload builder');
        var payloadVariables = window.optly.sendBeacon.payloadVariables(eventName);
        console.log(payloadVariables);
        var payloadData = JSON.stringify(window.optly.sendBeacon.payloadVariables(payloadVariables));
        console.log(payloadData);
        return navigator.sendBeacon('https://logx.optimizely.com/v1/events', payloadData);
    // }
    // else if (eventId == undefined){
    //     console.log("event ID is undefined for event name: " + eventNamee);
    // }    
};
 
// window["optimizely"] = window["optimizely"] || [];
// window["optimizely"].push({
//   type: "addListener",
//   filter: {
//     type: "lifecycle",
//     name: "activated"
//   },
//   // Add the initialized function as a handler.
//   handler: activated
// });

//usage

$('a').bind('mousedown',function(){
    window.optly.sendBeacon.sendEvent('testGoal');
    
});


