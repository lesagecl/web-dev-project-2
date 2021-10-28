DROP TABLE IF EXISTS schedule;

CREATE TABLE schedule (
    id INT PRIMARY KEY,
    start_time TIME,
    end_time TIME,
    week_day VARCHAR(10),
    is_deleted INT DEFAULT 0
);