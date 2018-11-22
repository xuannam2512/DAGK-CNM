var express = require('express'),
    moment = require('moment');
var router = express.Router();
var requestRepo = require('../repos/requestRepo');
var events = require('./events');
var broadCastAll = require('../ws').broadcastAll

router.get('/', (req, res) => {
    var ts = 0;
    if (req.query.ts) {
        ts = +req.query.ts;
    }
   
    
    requestRepo.loadAll()
        .then(rows => {
            var return_ts = moment().unix();
            res.json({
                return_ts,
                rows
            });
        }).catch(err => {
            console.log(err);
            res.statusCode = 500;
            res.end('view error log on console');
        })
  
})


router.post('/', (req, res) => {
    var c = {
        id: 0,
        nameString : req.body.nameString,
        phone : req.body.phone,
        addressString :req.body.addressString,
        noteString: req.body.noteString,
        activeDate: moment().format('YYYY/MM/DD'),
        iat: moment().unix(),
        status: req.body.status        
    }

    requestRepo.insert(c)
    .then(data=>
        {
            console.log(data.insertId);
            c.id = data.insertId;
            // sse
            events.publishRequestAdded(c);
            res.statusCode = 201;
            res.json({
                msg: 'inserted'
            });
        })
        .catch(err => {
            console.log(`err : ${err}`);
        });      
})

router.put('/', (req, res) => {
    console.log(req.body);
    var c = {
        id: req.body.id,
        nameString : req.body.nameString,
        phone: req.body.phone,
        addressString: req.body.addressString,
        noteString: req.body.noteString,
        status: req.body.status,
        x: req.body.x,
        y: req.body.y
    }

    requestRepo.updateDetail(c)
    .then(data=>
    {
        res.statusCode = 201;
        res.json({
            msg: 'updated'
        });
    })
    .catch(err => {
        res.statusCode = 204;
        console.log(`err : ${err}`);
        res.end();
    });
  
    events.publishRequestChanged(c);

    if(req.body.isFindDriver) {
        broadCastAll(c);
    }    
})

module.exports = router;