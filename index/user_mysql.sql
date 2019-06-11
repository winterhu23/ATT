
create database card_game;

use card_game;

create table user{
    id int primary key auto_increment,
    username varchar(128) not null unique,
    
}