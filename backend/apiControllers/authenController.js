var express = require('express');
var router = express.Router();
var authen = require('../repos/authenRepo');

router.post('/accesstoken', (req, res) => {
        authen.refreshAccessToken(req.body.refeshToken)
        .then((data)=>{
                res.status = 201;
                res.json({
                    "accesToken": data
                });
        })
        .catch((err)=>{
            console.log(err);
            res.statusCode = 500;
            res.end();
        })

});

module.exports = router;
