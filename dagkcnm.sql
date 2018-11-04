create database dagkcnm;

use dagkcnm;

CREATE TABLE `users` (
  `userId` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) UNIQUE COLLATE utf8_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `name` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `email` varchar(50) UNIQUE COLLATE utf8_unicode_ci NOT NULL,
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
