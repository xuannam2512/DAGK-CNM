var db = require('../fn/genericMySql');

exports.loadAll = ()=>{

    var sql = 'select * from requests'
    return db.excuteQuery(sql);
}

exports.insert = (request)=>{
    console.log(request);
    
    var sql = `insert into requests (nameString,phone,addressString,noteString,status,activeDate,iat) values(N'${request.nameString}','${request.phone}',N'${request.addressString}',N'${request.noteString}',N'${request.status}','${request.activeDate}',${request.iat})`;
    //console.log(sql);
    
    return db.excuteQuery(sql);
}

exports.update = (request)=>{
    //console.log(request.activeDate);
    
    var sql = `update  requests set nameString = N'${request.nameString}', x = ${request.x} , y=${request.y} ,addressString =N'${request.addressString}', phone = '${request.phone}', noteString = N'${request.noteString}', status = N'${request.status}' where id = ${request.id}`;
    //console.log(sql);
    
    return db.excuteQuery(sql);
}

exports.updateStatus = (request) => {
    var sql = `update  requests set status = N'${request.status}' where id = ${request.id}`;

    return db.excuteQuery(sql);
}