DROP TABLE IF EXISTS schedule;

CREATE TABLE schedule (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(10),
    start_time INT,
    end_time INT,
    week_day VARCHAR(10),
    is_deleted INT DEFAULT 0
);

INSERT INTO schedule (first_name, start_time, end_time, week_day, is_deleted) VALUES ('John', 2, 4, 'Wednesday', 0);
INSERT INTO schedule (first_name, start_time, end_time, week_day, is_deleted) VALUES ('John', 7, 11, 'Monday', 0);
INSERT INTO schedule (first_name, start_time, end_time, week_day, is_deleted) VALUES ('John', 1, 4, 'Friday', 0);