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
   
   
   
    return new Promise((resolve, reject) => {
        var sql = `SELECT *  FROM dagkcnm.user_refresh_token where refresToken =  '${refreshToken}'`;
       
        db.excuteQuery(sql)
            .then((data) => {
                console.log('________________')
                console.log(data);
                var countRow1 = data.length;
                if (countRow1 >0) {
                    var sqlnext = `select * from	 users where userID = ${data[0].userId}`;
                   return db.excuteQuery(sqlnext)
                   
                }
                
            })
            .then((data) => {
                var rowRow2 = data.length;
                        if (rowRow2 > 0) {
                            resolve(this.generateAccessToken(data)) ;
                        }
            })
            .catch((err) => {
                reject(err);
            })
    })
}