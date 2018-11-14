var express = require('express'),
    moment = require('moment');
var router = express.Router();
var requestRepo = require('../repos/requestRepo');
var events = require('./events');

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
        nameString : req.body.nameString,
        phone : req.body.phone,
        addressString :req.body.addressString,
        noteString: req.body.noteString,
        activeDate: moment().format('YYYY/MM/DD'),
        iat: moment().unix()
    }

    requestRepo.insert(c)
    .then(data=>
        {
            res.statusCode = 201;
            res.json({
                msg: 'inserted'
            });
        })
        .catch(err => {
            console.log(`err : ${err}`);
        });
  
    // sse
    events.publishRequestAdded(c);
})

router.put('/', (req, res) => {
    console.log(req.body);
    var c = {
        id: req.body.id,
        addressString : req.body.addressString,
        x : req.body.x,
        y : req.body.y
    }

    requestRepo.update(c)
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
        });
})

router.put('/updateDetail', (req, res) => {
    console.log(req.body);
    var c = {
        id: req.body.id,
        nameString : req.body.nameString,
        phone: req.body.phone,
        addressString: req.body.addressString,
        noteString: req.body.noteString,
        statusCode: req.body.statusCode
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
        });
  
    events.publishRequestChanged(c);
})

module.exports = router;