var express = require("express");
var driverRepo = require("../repos/driverRepo");
var broadcastAll = require('../ws').broadcastAll;
var verifyAccessToken = require("../repos/authenRepo").verifyAccessToken;

var router = express.Router();

router.get("/", verifyAccessToken, (req, res) => {
  res.json({
    message: "Hello World"
  });
});

router.get('/:id', verifyAccessToken, (req, res) => {
  driverRepo.getDriverInfo(req.params.id)
    .then(rows => {
        res.statusCode = 200;
        res.json(rows);
    })
    .catch(err => {
        res.statusCode = 500;
        res.end();
    });
})

//insert driver
router.post("/", (req, res) => {
  driverRepo
    .insert(req.body)
    .then(data => {
      console.log(data);
      res.statusCode = 201;
      res.json(data);
    })
    .catch(err => {
      console.log(err);
      res.statusCode = 500;
      res.end();
    });
});

router.put("/", verifyAccessToken, (req, res) => {
  driverRepo
    .update(req.body)
    .then(data => {
      console.log(data);
      res.statusCode = 200;
      res.json(data);
    })
    .catch(err => {
      console.log(err);
      res.statusCode = 500;
      res.end();
    });
});

module.exports = router;
