create database dagkcnm;

use dagkcnm;

CREATE TABLE `users` (
  `userId` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) UNIQUE COLLATE utf8_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `name` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `email` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `dob` date NOT NULL,
  `permission` int(11) NOT NULL,
  PRIMARY KEY (`userId`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

create table user_refresh_token (
	userId int(11) auto_increment unique not null,
    refresToken varchar(100) not null,
    refreshDate datetime,
    primary key (userId)
);

insert into users (username, password, name, email, dob, permission) values ('admin', '123456', 'Nam', 'xuannam2512@gmail.com', '1997-12-25', 0);

-- tạo mới ngày 10/11/2018 : 3:34 pm
create table requests(
id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
nameString nvarchar(255),
phone varchar(11),
addressString nvarchar(255),
noteString nvarchar(255),
activeDate datetime,
iat int,
status varchar(50) not null,
x varchar(50),
y varchar(50),
driverId int(11)
);
-- tao moi ngay 22/11/2018
create table drivers (
	id int(11) unique auto_increment not null,    
    x varchar(50),
    y varchar(50),
    userID int(11),
    status nvarchar(50),
    primary key(id),
    FOREIGN key (userID) references users(userId)
)ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;