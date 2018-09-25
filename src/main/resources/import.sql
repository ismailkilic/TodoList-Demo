insert into role(id,name) values (1, 'USER');
insert into role(id,name) values (2, 'ACTUATOR');

insert into users(id, account_non_expired, account_non_locked, credentials_non_expired, email, enabled, name, password) values (1, TRUE, TRUE, TRUE, 'ismail@example.com', TRUE, 'İsmail User', 'password');
insert into users(id, account_non_expired, account_non_locked, credentials_non_expired, email, enabled, name, password) values (2, TRUE, TRUE, TRUE, 'ismailkilic@example.com', TRUE, 'İsmail KILIC User', 'password');

insert into user_roles(user_id, roles_id) values (1, 1);
insert into user_roles(user_id, roles_id) values (1, 2);
insert into user_roles(user_id, roles_id) values (2, 1);

insert into todo_list(id, name, owner_user_id,create_at) values (1, 'Test List 1', 1, '2018-09-23');
insert into todo_list(id, name, owner_user_id,create_at) values (2, 'Test List 2', 1, '2018-09-14');

insert into todo_item(id, name, todo_list_id, completed, owner_user_id,description,deadline,create_at) values (1, 'Item 1', 1, FALSE, 1,'Description 1','2018-09-28','2018-09-24');
insert into todo_item(id, name, todo_list_id, completed, owner_user_id,description,deadline,create_at) values (2, 'Item 2', 1, FALSE, 1,'Description 2','2018-09-28','2018-09-25');
insert into todo_item(id, name, todo_list_id, completed, owner_user_id,description,deadline,create_at,TODO_ITEM_PARENT_ID) values (7, 'Sub Item', 1, FALSE, 1,'Description 4','2018-09-28','2018-09-25',2);
insert into todo_item(id, name, todo_list_id, completed, owner_user_id,description,deadline,create_at,TODO_ITEM_PARENT_ID) values (8, 'Sub Item', 1, FALSE, 1,'Description 5','2018-09-28','2018-09-26',2);
insert into todo_item(id, name, todo_list_id, completed, owner_user_id,description,deadline,create_at) values (3, 'Item 3', 1, FALSE, 1,'Description 3','2018-09-28','2018-09-24');
insert into todo_item(id, name, todo_list_id, completed, owner_user_id,description,deadline,create_at,TODO_ITEM_PARENT_ID) values (9, 'Sub Item', 1, FALSE, 1,'Description sub','2018-09-28','2018-09-25',3);
insert into todo_item(id, name, todo_list_id, completed, owner_user_id,description,deadline,create_at,TODO_ITEM_PARENT_ID) values (10, 'Sub Item', 1, FALSE, 1,'Description sub','2018-09-28','2018-09-26',3);

insert into todo_item(id, name, todo_list_id, completed, owner_user_id,description,deadline,create_at) values (4, 'Item A', 2, FALSE, 1,'Description 4','2018-09-28','2018-09-24');
insert into todo_item(id, name, todo_list_id, completed, owner_user_id,description,deadline,create_at,TODO_ITEM_PARENT_ID) values (12, 'Sub Item', 2, FALSE, 1,'Description sub','2018-09-28','2018-09-26',4);

insert into todo_item(id, name, todo_list_id, completed, owner_user_id,description,deadline,create_at) values (5, 'Item B', 2, FALSE, 1,'Description 5','2018-09-28','2018-09-24');
insert into todo_item(id, name, todo_list_id, completed, owner_user_id,description,deadline,create_at,TODO_ITEM_PARENT_ID) values (11, 'Sub Item', 2, FALSE, 1,'Description sub','2018-09-28','2018-09-25',5);
insert into todo_item(id, name, todo_list_id, completed, owner_user_id,description,deadline,create_at,TODO_ITEM_PARENT_ID) values (13, 'Sub Item', 2, FALSE, 1,'Description sub','2018-09-28','2018-09-25',5);
insert into todo_item(id, name, todo_list_id, completed, owner_user_id,description,deadline,create_at) values (6, 'Item C', 2, FALSE, 1,'Description 6','2018-09-28','2018-09-24');