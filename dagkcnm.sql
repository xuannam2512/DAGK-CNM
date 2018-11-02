create database dagkcnm;

use dagkcnm;

create table users (
	userId int(11) auto_increment unique not null,
    username varchar(30) not null unique,
    password varchar(100) not null,
    email varchar(40) not null unique,
    dob date,
    permission int(11),
    primary key (userId)
);

create table user_refresh_token (
	userId int(11) auto_increment unique not null,
    refresToken varchar(100) not null,
    refreshDate datetime,
    primary key (userId)
);
