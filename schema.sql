DROP TABLE IF EXISTS schedule;

CREATE TABLE schedule (
    id SERIAL PRIMARY KEY,
    start_time TIME,
    end_time TIME,
    week_day VARCHAR(10)
);