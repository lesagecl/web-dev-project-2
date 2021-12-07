DROP TABLE IF EXISTS schedule;

CREATE TABLE schedule (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(10),
    start_time INT,
    end_time INT,
    week_day INT,
    is_deleted INT DEFAULT 0
);

INSERT INTO schedule (first_name, start_time, end_time, week_day, is_deleted) VALUES ('John', 2, 4, 3, 0);
INSERT INTO schedule (first_name, start_time, end_time, week_day, is_deleted) VALUES ('John', 7, 11, 1, 0);
INSERT INTO schedule (first_name, start_time, end_time, week_day, is_deleted) VALUES ('John', 1, 4, 5, 0);
INSERT INTO schedule (first_name, start_time, end_time, week_day, is_deleted) VALUES ('Jane', 0, 3, 4, 0);
INSERT INTO schedule (first_name, start_time, end_time, week_day, is_deleted) VALUES ('Jane', 6, 12, 4, 0);