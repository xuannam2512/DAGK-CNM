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
        .catch(err => {
            console.log(`err : ${err}`);
        });
  
    res.statusCode = 201;
    res.json({
        msg: 'added'
    });
    // sse
    events.publishCategoryAdded(c);
})

router.put('/', (req, res) => {
    var c = {
        id: req.body.id,
        nameString : req.body.nameString,
    }

    requestRepo.insert(c)
        .catch(err => {
            console.log(`err : ${err}`);
        });
  
    res.statusCode = 201;
    res.json({
        msg: 'added'
    });
    // sse
    events.publishCategoryAdded(c);
})



module.exports = router;