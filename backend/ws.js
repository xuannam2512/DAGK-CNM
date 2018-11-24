var WebSocket = require('ws');
var driverRepo = require('./repos/driverRepo');
var requestRepo = require('./repos/requestRepo');
var events = require('./apiControllers/events');
var math = require('mathjs');

var SOCKET_PORT = process.env.SOCKET_PORT || 40510;
var socketServer;
var response = 'NO';

if (!socketServer) {
    socketServer = new WebSocket.Server({
        port: SOCKET_PORT
    });

     socketServer.on('connection', ws => {

        ws.on('message', msg => {
            response = msg;
            console.log(`receive: ${msg}`);            
        });

    //     // var num = 0;
    //     // setInterval(() => {
    //     //     ws.send(num++);
    //     // }, 1000);
     });

    console.log(`WS running on port ${SOCKET_PORT}`);
}

var broadcastAll = async function (request) {
    let i;

    console.log(request);
    request.status = "Dang tim xe";
    events.publishRequestChanged(request);
    let s = [];
    for (var c of socketServer.clients) {
        await findDriver(c.protocol, s, request);
    }
    
    //sort
    await sortDistance(s);

    console.log("start send request");
    for(i = 0; i < s.length; i++){
        for(let c of socketServer.clients) {
            console.log(c.readyState);
            if (c.protocol === s[i].userId && c.readyState === WebSocket.OPEN) {
                console.log("Equal", s[i]);
                await c.send(JSON.stringify(request));
                break;
            }
        }
        console.log(i);
        //listen response
        let res = await listenResponse();
        if(response === 'YES') {
            console.log("Response: ", response);
            break;
        }
    }

    if(response === 'YES') {
        request.status = 'Da co xe nhan';
        await updateRequest(request);

        //update driverId into request table
        requestRepo.updateDriverId(s[i].id, request.id)
        .then(value => {
            let newRequest = {
                id: request.id,
                nameString : request.nameString,
                phone: request.phone,
                addressString: request.addressString,
                noteString: request.noteString,
                status: request.status,
                x: request.x,
                y: request.y,
                driverId: s[i].id
            }
            console.log(newRequest);
            events.publishRequestChanged(newRequest);                     
        })
        .catch(err => {
            console.log("error: ", err);
        })  
    } else {
        console.log(response);
        request.status = 'Khong co xe nhan';
        await updateRequest(request);
        events.publishRequestChanged(request);
    } 

    response = 'NO'    
    console.log("done");
}

async function updateRequest(object) {
    console.log("updating");
    await requestRepo.updateDetail(object)
        .then(value => {
            console.log("Updated: ", value);
        })
        .catch(err => {
            console.log(err);
        })
}

async function listenResponse() {
    return await listen();
}

function listen() {
    return new Promise((resolve, reject) => {        
        setInterval(() => {
            resolve("NO");
        }, 10000);                    
    })
}

async function findDriver(userId, s, object) {
    await driverRepo.findDriversByUserIdAndStatus(userId)
        .then(data => {
            let d = getDistanceFromLatLonInKm(data[0].x, data[0].y, object.x, object.y);
            let c = {
                id: data[0].id,
                distance: d,
                userId: userId
            }
            s.push(c);
        })
        .catch(err => {
            console.log(err);
        })
}

async function sortDistance(s) {
    await sorting(s);
    console.log("sorting");
}
function sorting(s)
{
  return new Promise(resolve => {
      resolve(s.sort(function(a, b) {
          return a.distance - b.distance;
      }));
  });
}

//caculate the distance between two point by using haiversine
function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) { 
    var R = 6371; // Radius of the earth in km 
    var dLat = deg2rad(lat2-lat1); // deg2rad below 
    var dLon = deg2rad(lon2-lon1); 
    var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) + 
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2) 
    ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km 
    return d; 
} 

function deg2rad(deg) { 
    return deg * (Math.PI/180) 
} 

module.exports = {
    socketServer,
    broadcastAll
}