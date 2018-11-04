var db = require('../fn/genericMySql');
var jwt = require('jsonwebtoken');
var randToken = require('rand-token');
var moment = require('moment');

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

exports.updateRefreshToken = (userId, refreshToken) => {
    return new Promise((resolve, reject) => {
        var deleteSql = `delete from user_refresh_token where userId = ${userId}`;

        db.excuteQuery(deleteSql)
            .then((data) => {
                var refreshTokenTime = moment().format('YYYY-MM-DD HH:mm:ss');
                console.log(refreshTokenTime);
                var insertSql = `insert into user_refresh_token values ('${userId}', '${refreshToken}', '${refreshTokenTime}')`;

                return db.excuteQuery(insertSql);
            })
            .then((data) => {
                resolve(data);
            })
            .catch((err) => {
                reject(err);
            })
    })
}

exports.refreshAccessToken = (refreshToken) => {
    console.log(refreshToken);
}