var express = require('express');

var router = express.Router();

//test
router.get('/', (req, res) => {
    res.json({
        "message": "Hello user"
    });
});

router.post('/', (req, res) => {    
    //write some code here
});

router.post('/login', (req, res) => {
    //write some code here
});

router.get('/logout', (req, res) => {
    //write some code here
});

module.exports = router;

