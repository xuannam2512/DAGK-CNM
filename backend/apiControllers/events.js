var eventEmitter = require('eventemitter3');
var emitter = new eventEmitter();

var subscribeEvent = (req, res, event) => {
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });
    //console.log('toi dang o in event.js');
    //console.log(req.body.name);
    
    
    var heartBeat = setInterval(() => {
        res.write('\n');
    }, 15000);

    var handler = data => {
        var json = JSON.stringify(data);
        res.write(`retry: 500\n`);
        res.write(`event: ${event}\n`);
        res.write(`data: ${json}\n`);
        res.write(`\n`);
    }

    emitter.on(event, handler);

    req.on('close', () => {
        clearInterval(heartBeat);
        emitter.removeListener(event, handler);
    });
}

//
// event pub-sub

var REQUEST_ADDED = 'REQUEST_ADDED';

var subscribeRequestAdded = (req, res) => {
    subscribeEvent(req, res, REQUEST_ADDED);
    
}

var publishRequestAdded = requestObj => {
    emitter.emit(REQUEST_ADDED, requestObj);
}

module.exports = {
    subscribeRequestAdded,
    publishRequestAdded
}