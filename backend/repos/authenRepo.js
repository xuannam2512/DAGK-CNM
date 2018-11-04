var db = require('../fn/genericMySql');
var jwt = require('jsonwebtoken');
var randToken = require('rand-token');

const SECRET_KEY = "123456";
const AC_LIFETIME = 3600;
const SIZE = 80;

exports.generateAccessToken = (userEntity) => {
    let payload = {
        user: userEntity
    }

    let accessToken = jwt.sign(payload, SECRET_KEY, {
        expiresIn: AC_LIFETIME
    });

    return accessToken;
}

exports.generateRefreshToken = () => {
    var refreshToken = randToken.generate(SIZE);
    return refreshToken;
}

exports.refreshAccessToken = (refreshToken) => {
    console.log(refreshToken);
}