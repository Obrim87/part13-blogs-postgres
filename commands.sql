-- Exercise 13.2

-- Create table

create table blogs (
  id serial primary key,
  author text,
  url text not null,
  title text not null,
  likes integer DEFAULT 0
);

insert into blogs (author, url, title, likes)
values ('Michael OBrien', 'www.myblog.com', 'My First Blog', 69),
        ('Sonja OBrien', 'www.mybetterblog.com', 'My Better Blog', DEFAULT);

