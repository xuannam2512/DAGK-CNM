var express = require('express');

var router = express.Router();

var userRepo = require('../repos/userRepo');
var authenRepo = require('../repos/authenRepo');
var verifyAccessToken = require('../repos/authenRepo').verifyAccessToken;
//test
router.get('/',verifyAccessToken, (req, res) => {
    // console.log(req.body);
    userRepo.loadAll()
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

//register a account.
router.post('/', (req, res) => {
    userRepo.create(req.body)
        .then(data => {
            res.statusCode = 201;
            res.json(data);
        })
        .catch((err) => {
            //username is exist
            let value = err.toString();
            if (value.indexOf("username") > 0) {
                res.statusCode = 203;
                res.json({
                    "message": "Username Invalid"
                });
            } else {
                console.log(err);
                res.statusCode = 500;
                res.end();
            }
        });
});

//login account
router.post('/login', (req, res) => {

    userRepo.login(req.body)
        .then(data => {
            var countRow = data.length;
            console.log(countRow);
            if (countRow > 0) {
                //  đăng nhập thành công
                var accessToken = authenRepo.generateAccessToken(data);
                var refeshToken = authenRepo.generateRefreshToken();
                authenRepo.updateRefreshToken(data[0].userId, refeshToken)
                res.statusCode = 201;
                res.json({
                    "user": data[0],
                    "accessToken": accessToken,
                    "refreshToken": refeshToken
                });
            } else {
                res.statusCode = 204;
                res.end();
            }
        })
        .catch((err) => {
            console.log(err);
            res.statusCode = 500;
            res.end();
        })
});

router.post('/logout',verifyAccessToken, (req, res) => {
    //write some code here
    console.log(req.body.userId);
    userRepo.logout(req.body.userId)
        .then(data => {
            console.log("Logout success");
            res.status = 200;
            res.end();
        }).catch((err) => {
            console.log(err);
            res.statusCode = 500;
            res.end();
        })
});

module.exports = router;

