var db = require('../fn/genericMySql');

exports.loadAll = ()=>{

    var sql = 'select * from requests'
    return db.excuteQuery(sql);
}

exports.insert = (request)=>{
    //console.log(request.activeDate);
    
    var sql = `insert into dagkcnm.requests (nameString,phone,addressString,noteString,activeDate,iat) values(N'${request.nameString}','${request.phone}',N'${request.addressString}',N'${request.noteString}','${request.activeDate}',${request.iat})`;
    //console.log(sql);
    
    return db.excuteQuery(sql);
}