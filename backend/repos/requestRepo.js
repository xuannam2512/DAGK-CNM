var db = require('../fn/genericMySql');

exports.loadAll = ()=>{

    var sql = 'select * from requests order by iat desc'
    return db.excuteQuery(sql);
}

exports.insert = (request)=>{
    //console.log(request.activeDate);
    
    var sql = `insert into dagkcnm.requests (nameString,phone,addressString,noteString,activeDate,iat,statusCode) values(N'${request.nameString}','${request.phone}',N'${request.addressString}',N'${request.noteString}','${request.activeDate}',${request.iat}, 1)`;
    //console.log(sql);
    
    return db.excuteQuery(sql);
}

exports.update = (request)=>{
    //console.log(request.activeDate);
    
    var sql = `update  requests set x = ${request.x} , y=${request.y} , addressString =N'${request.addressString}' where id = ${request.id}`;
    //console.log(sql);
    
    return db.excuteQuery(sql);
}