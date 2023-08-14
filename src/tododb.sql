create database tododb;

drop table if exists todo;

create table todo(
    todo_id serial primary key,
    task varchar(255),
    creation_date date not null,
    due_date date not null,
    completed boolean default 'false'
);

insert into todo (task, creation_date,due_date, completed)
values ('Finish project proposal', '2023-08-15','2023-08-30',false);