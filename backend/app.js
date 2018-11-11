var express = require("express"),
    bodyParser = require("body-parser"),
    morgan = require("morgan"),
    cors = require("cors");

var app = express();
var userController = require('./apiControllers/userController');
var authenController = require('./apiControllers/authenController');
var requestController = require('./apiControllers/requestController');
var events = require('./apiControllers/events');
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(cors());

app.use('/api/users', userController);
app.use('/api/authen', authenController);
app.get('/api', (req, res) => {
    res.json({
        "message": "Hello world!!"
    });
})
app.use('/api/requests',requestController);
//SSE
app.get('/categoryAddedEvent', events.subscribeCategoryAdded);

var port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`listening on port ${port}`);
});