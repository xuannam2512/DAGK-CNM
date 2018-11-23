var db = require("../fn/genericMySql");

exports.insert = driverEntity => {
  let sql = `insert into drivers (userId, status) values (${
    driverEntity.userId
  }, N'${driverEntity.status}')`;

  return db.excuteQuery(sql);
};

exports.update = driverEntity => {
  let sql = `update drivers set x = '${driverEntity.x}', y = '${
    driverEntity.y
    }', status = N'${driverEntity.status}' where userId = ${driverEntity.userId}`;

  return db.excuteQuery(sql);
};

exports.findDriversByUserIdAndStatus = function(userId) {
  let sql = `select * from drivers where userId = ${userId} and status = N'Active'`;

  return db.excuteQuery(sql);
}

exports.getDriverInfo = driverId => {
  let sql = `select d.x, d.y, u.name from drivers d, users u where d.userId = u.userId and d.id = ${driverId}`;
  return db.excuteQuery(sql);
}