CREATE DATABASE world;

CREATE TABLE user_table(
  user_id serial int primary key
  user_name varchar(100) NOT NULL,
  user_color varchar(20) NOT NULL,
);

CREATE TABLE visited_countries(
  visit_id serial int primary key,
  country_code char(2) NOT NULL,
  user_id int NOT NULL,
  FOREIGN key (user_id) references user_table(user_id)
);




