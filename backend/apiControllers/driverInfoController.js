var express = require("express");
var driverRepo = require("../repos/driverRepo");
var verifyAccessToken = require("../repos/authenRepo").verifyAccessToken;

var router = express.Router();

router.get("/:driverId", verifyAccessToken, (req, res) => {
    driverRepo.getDriverInfo(req.params.driverId)
    .then(rows => {
        res.statusCode = 200;
        res.json(rows);
    })
    .catch(err => {
        res.statusCode = 500;
        res.end();
    });
});

module.exports = router;