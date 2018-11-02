var express = require("express"),
    bodyParser = require("body-parser"),
    morgan = require("morgan");

var app = express();
var userController = require('./apiControllers/userController');

app.use(morgan('dev'));
app.use(bodyParser.json());

app.use('/api/users', userController);
app.get('/api', (req, res) => {
    res.json({
        "message": "Hello world!!"
    });
})


var port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`listening on port ${port}`);
});