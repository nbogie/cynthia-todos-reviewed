create database tododb;

drop table if exists todo;

create table todo(
    todo_id serial primary key,
    description varchar(255) not null,
    creation_date date not null,
    completed boolean default 'false'
);

insert into todo (description, creation_date, completed)
values ('Finish project proposal', '2023-08-15',false);

select * 
from todo 
where todo_id = 1;

update todo set description = 'wash dishes', completed = false  where todo_id = 1;

delete from todo where todo_id = 1;