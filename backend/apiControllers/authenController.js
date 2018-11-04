var express = require('express');

var router = express.Router();

var authen = require('../repos/authenRepo');

router.get('/', (req, res) => {
    res.json({
        "message": "Authen"
    });
});

router.post('/refreshtoken', (req, res) => {
    console.log(req.body);

    let refreshToken = authen.generateRefreshToken(req.body);

    res.json(refreshToken);
});

router.post('/accesstoken', (req, res) => {
    console.log(req.body);

    let accessToken = authen.generateRefreshToken(req.body);
    res.json(accessToken);
});

module.exports = router;
