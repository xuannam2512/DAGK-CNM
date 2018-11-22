var db = require('../fn/genericMySql');

exports.loadAll = ()=>{

    var sql = 'select * from requests order by iat desc'
    return db.excuteQuery(sql);
}

exports.insert = (request)=>{
    console.log(request);
    
    var sql = `insert into dagkcnm.requests (nameString,phone,addressString,noteString,activeDate,iat,status) values(N'${request.nameString}','${request.phone}',N'${request.addressString}',N'${request.noteString}','${request.activeDate}',${request.iat}, N'${request.status}')`;
    //console.log(sql);
    
    return db.excuteQuery(sql);
}

exports.update = (request)=>{
    //console.log(request.activeDate);
    
    var sql = `update  requests set nameString = N'${request.nameString}', x = ${request.x} , y=${request.y} ,addressString =N'${request.addressString}', phone = '${request.phone}', noteString = N'${request.noteString}', status = N'${request.status}' where id = ${request.id}`;
    //console.log(sql);
    
    return db.excuteQuery(sql);
}

exports.updateDetail = (request) => {
    
    var sql = `update  requests set nameString = N'${request.nameString}', phone = '${request.phone}', addressString = N'${request.addressString}', noteString = N'${request.noteString}', status = N'${request.status}', x = '${request.x}', y = '${request.y}' where id = ${request.id}`;

    return db.excuteQuery(sql);
}