var db = require('../fn/genericMySql');
var md5 = require('crypto-js/md5');


exports.loadAll  = userEntity =>{
    var sql = `select * from users`;
    return db.excuteQuery(sql);
}


exports.create = userEntity => {
    let md5_password = md5(userEntity.password);
    let sql = `insert into users (username, password, name, email, dob, permission) values ('${userEntity.username}', '${md5_password}', '${userEntity.name}', '${userEntity.email}', '${userEntity.dob}', '${userEntity.permission}')`;

    return db.excuteQuery(sql);
}

// exports.login = function(loginEntity) {   //write some code here }
exports.login = (userEntity) => {
    var md5_password = md5(userEntity.password);
    
    
    var sql =  `select * from	 users where username = '${userEntity.username}' and password = '${md5_password}' and permission = ${userEntity.permission}`;
    return db.excuteQuery(sql);
}

exports.logout = (userId) => {
    //write some code here
    var sql =  `delete from user_refresh_token where userId = ${userId}`;
    return db.excuteQuery(sql);
}