var express = require('express');

var router = express.Router();

var userRepo = require('../repos/userRepo');
var authenRepo = require('../repos/authenRepo');
//test
router.get('/', (req, res) => {
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
    // console.log(req.body);
    userRepo.create(req.body)
        .then(data => {
            //console.log(data);
            res.statusCode = 201;
            res.json(data);
        })
        .catch((err) => {
            var value = err.toString();
            var error = ''
            if (value.indexOf("email") > 0) {
                error = value.substr(value.indexOf("email"), 5);
            } else if (value.indexOf("username") > 0) {
                error = value.substr(value.indexOf("username"), 8);
            }

            res.statusCode = 500;
            res.json({
                "error": error,
                "message": value
            });
        });
});

router.post('/login', (req, res) => {
    //write some code here
    // req.body :  lấy tất cả các biến truyền vào ở body

    userRepo.login(req.body)
        .then(data => {
            var countRow = data.length;
            if (countRow > 0) {
                //  đăng nhập thành công
                var accessToken = authenRepo.generateAccessToken(data);
                var refeshToken = authenRepo.generateRefreshToken();
                authenRepo.updateRefreshToken(data[0].userId, refeshToken)
                res.status = 201;
                res.json({
                    "user": data[0],
                    "accesToken": accessToken,
                    "refeshToken": refeshToken
                });

            }

        })
        .catch((err) => {
            console.log(err);
            res.statusCode = 500;
            res.end();
        })
});

router.post('/logout', (req, res) => {
    //write some code here
    userRepo.logout(req.body)
        .then(data => {
            res.status = 201;
            res.end();
        }).catch((err) => {
            console.log(err);
            res.statusCode = 500;
            res.end();
        })
});

module.exports = router;

