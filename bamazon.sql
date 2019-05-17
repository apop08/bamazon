drop database bamazon;
create database if not exists bamazon;

use bamazon;

create table if not exists departments(
department_id int not null auto_increment,
department_name varchar(100),
overhead_costs float(10) default 0.00,
sales float(10) default 0.00,
primary key(department_id)
);

create table if not exists products(
item_id int not null auto_increment,
product_name varchar(100),
department_name varchar(100),
price float(10),
stock_quantity int(100),
primary key(item_id)
);

-- populate table
insert into products (product_name, department_name, price, stock_quantity)
values ("steak", "meat", 20.0, 20), ("potatoes", "produce", 5.5, 100), ("strawberries", "produce", 3.99, 15), ("skittles", "candy", 1.99, 40),
("pork chops", "meat", 12.39, 5), ("iphone", "electronics", 999.99, 24), ("television", "electronics", 499.99, 15), ("milk", "dairy", 4.99, 35),
("party wings", "meat", 8.90, 12), ("drumsticks", "meat", 7.40, 10), ("whole chicken", "meat", 5.99, 3), ("whiskey", "alcohol", 12.99, 40);

insert into departments (department_name, overhead_costs)
values ("meat", 50), ("produce", 20), ("candy", 2), ("electronics", 1000), ("alcohol", 40);