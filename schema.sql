DROP TABLE IF EXISTS schedule;

CREATE TABLE schedule (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(10),
    start_time TIME,
    end_time TIME,
    week_day VARCHAR(10),
    is_deleted INT DEFAULT 0
);

INSERT INTO schedule (first_name, start_time, end_time, week_day, is_deleted) VALUES ('Johnson', '14:00', '17:30', 'Wednesday', 0);