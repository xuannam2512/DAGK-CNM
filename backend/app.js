var express = require("express"),
    bodyParser = require("body-parser"),
    morgan = require("morgan");

var app = express();

app.use(morgan('dev'));
app.use(bodyParser.json());

app.get('/api', (req, res) => {
    res.json({
        "message": "Hello world!!"
    });
})

var port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`listening on port ${port}`);
});