DROP TABLE IF EXISTS schedule;

CREATE TABLE schedule (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(10),
    start_time VARCHAR(10),
    end_time VARCHAR(10),
    week_day VARCHAR(10),
    is_deleted INT DEFAULT 0
);

INSERT INTO schedule (first_name, start_time, end_time, week_day, is_deleted) VALUES ('John', '14:00', '17:00', 'Wednesday', 0);
INSERT INTO schedule (first_name, start_time, end_time, week_day, is_deleted) VALUES ('John', '14:00', '17:00', 'Monday', 0);
INSERT INTO schedule (first_name, start_time, end_time, week_day, is_deleted) VALUES ('John', '10:00', '13:00', 'Friday', 0);