create database tododb;

drop table if exists todo;

create table todo(
    todo_id serial primary key,
    description varchar(255) not null,
    creation_date date not null,
    completed boolean default 'false'
);

insert into todo (description, creation_date, completed)
values
    ('Finish project proposal', '2023-08-15', false),
    ('Buy groceries', '2023-08-16', false),
    ('Call client', '2023-08-17', false),
    ('Study for exam', '2023-08-18', false),
    ('Go for a run', '2023-08-19', false),
    ('Write blog post', '2023-08-20', false),
    ('Prepare presentation', '2023-08-21', false),
    ('Attend team meeting', '2023-08-22', false),
    ('Clean the house', '2023-08-23', false),
    ('Plan weekend trip', '2023-08-24', false);

select * 
from todo 
where todo_id = 1;

update todo set description = 'wash dishes', completed = false  where todo_id = 1;

delete from todo where todo_id = 1;