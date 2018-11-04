var db = require('../fn/genericMySql');
var md5 = require('crypto-js/md5');


exports.create = userEntity => {
    let md5_password = md5(userEntity.password);
    let sql = `insert into users (username, password, name, email, dob, permission) values ('${userEntity.username}', '${md5_password}', '${userEntity.name}', '${userEntity.email}', '${userEntity.dob}', '${userEntity.permission}')`;

    return db.excuteQuery(sql);
}

exports.login = loginEntity => {
    //write some code here
}

exports.logout = () => {
    //write some code here
}