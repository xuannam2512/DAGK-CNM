var express = require('express');

var router = express.Router();

var userRepo = require('../repos/userRepo');

//test
router.get('/', (req, res) => {
    res.json({
        "message": "Hello user"
    });
});

//register a account.
router.post('/', (req, res) => {  
    console.log(req.body);
    userRepo.create(req.body)
        .then(data => {
            //console.log(data);
            res.statusCode = 201;
            res.json(data);
        })
        .catch((err) => {
            console.log(err);
            res.statusCode = 500;
            res.end();
        });
});

router.post('/login', (req, res) => {
    //write some code here
});

router.get('/logout', (req, res) => {
    //write some code here
});

module.exports = router;

