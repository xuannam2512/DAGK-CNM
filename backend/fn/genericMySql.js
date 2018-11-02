var mysql = require('mysql');

var createConnection = () => {
    return mysql.createConnection({
    	host: '127.0.0.1',
    	port: '3306',
    	user: 'root',
    	password: 'root',
    	database: 'dagkcnm'
    });
}

exports.excuteQuery = sql => {
    return new Promise((resolve, reject) => {
        var cn = createConnection();
        cn.connect();
        cn.query(sql, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }

            cn.end();
        });
    });
}