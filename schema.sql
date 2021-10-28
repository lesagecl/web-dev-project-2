DROP TABLE IF EXISTS schedule;

CREATE TABLE schedule (
    id INT PRIMARY KEY,
    start_time TIME,
    end_time TIME,
    week_day VARCHAR(10),
    is_deleted INT DEFAULT 0
);

INSERT INTO schedule (id, start_time, end_time, week_day, is_deleted) VALUES ('9876', '14:00', '17:30', 'Wednesday', 0);