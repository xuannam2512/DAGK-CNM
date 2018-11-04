/**
 * test authentication api
 */

var express = require('express');

var router = express.Router();

var authen = require('../repos/authenRepo');

router.get('/', (req, res) => {
    res.json({
        "message": "Authen"
    });
});

router.get('/refreshtoken', (req, res) => {
    let refreshToken = authen.generateRefreshToken();
    authen.updateRefreshToken(1, refreshToken)
        .then((data) => {
            console.log(data);
            res.statusCode = 201;
            res.json(refreshToken);
        })
        .catch((err) => {
            console.log(err);
            res.statusCode = 500;
            res.end();
        })
});

router.post('/accesstoken', (req, res) => {
    console.log(req.body);

    let accessToken = authen.generateRefreshToken(req.body);
    res.json(accessToken);
});

module.exports = router;
