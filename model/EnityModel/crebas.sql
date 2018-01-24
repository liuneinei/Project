/*==============================================================*/
/* DBMS name:      MySQL 5.0                                    */
/* Created on:     2018-1-23 11:25:53                           */
/*==============================================================*/


drop table if exists kefu_member;

drop table if exists kefu_message;

drop table if exists kefu_room;

drop table if exists kefu_users;

/*==============================================================*/
/* Table: kefu_member                                           */
/*==============================================================*/
create table kefu_member
(
   id                   int not null,
   centerid             text,
   companyrltid         int,
   username             text,
   password             text,
   name                 text,
   img                  text,
   cookieid             text,
   messagenum           int,
   messagetime          datetime,
   status               int,
   addtime              datetime,
   primary key (id)
);

/*==============================================================*/
/* Table: kefu_message                                          */
/*==============================================================*/
create table kefu_message
(
   id                   int not null,
   companyrltid         int,
   roomid               text,
   forid                int,
   type                 int,
   content              text,
   isread               int,
   addtime              datetime,
   primary key (id)
);

/*==============================================================*/
/* Table: kefu_room                                             */
/*==============================================================*/
create table kefu_room
(
   room_id              int not null,
   member_id            int,
   member_socketid      text,
   user_id              int,
   user_cookieid        text,
   primary key (room_id)
);

/*==============================================================*/
/* Table: kefu_users                                            */
/*==============================================================*/
create table kefu_users
(
   id                   int not null,
   centerid             text,
   companyrltid         int,
   username             text,
   password             text,
   name                 text,
   img                  text,
   type                 int,
   status               int,
   cookieid             text,
   admitnum             int,
   addtime              datetime,
   primary key (id)
);

