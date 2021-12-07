const express = require('express');
const service = express();
service.use(express.json());

const port = 5001;
service.listen(port, () => {
  console.log(`We're live on port ${port}!`);
});

service.use((request, response, next) => {
  response.set('Access-Control-Allow-Origin', '*');
  next();
});

// permissions
service.options('*', (request, response) => {
  response.set('Access-Control-Allow-Headers', 'Content-Type');
  response.set('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE');
  response.sendStatus(200);
});

// sql credentials & parsing
const fs = require('fs');
const mysql = require('mysql');

const json = fs.readFileSync('credentials.json', 'utf8');
const credentials = JSON.parse(json);

const connection = mysql.createConnection(credentials);
connection.connect(error => {
  if (error) {
    console.error(error);
    process.exit(1);
  }
});

function rowToMemory(row) {
  return {
    id: row.id,
    first_name: row.first_name,
    start_time: row.start_time,
    end_time: row.end_time,
    week_day: row.week_day,
    is_deleted: row.is_deleted
  };
}

/* SELECT ENDPOINTS */

// get schedule for the week
service.get('/schedule', (request, response) => {
  const query = 'SELECT * FROM schedule WHERE is_deleted = 0';
  connection.query(query, (error, rows) => {
    if (error) {
      response.status(500);
      response.json({
        ok: false,
        results: error.message,
      });
    } else {
      const schedule = rows.map(rowToMemory);
      response.json({
        ok: true,
        results: rows.map(rowToMemory),
      });
    }
  });
});

// get schedule for a given id
service.get('/schedule/id/:id', (request, response) => {
  const parameter = [request.params.id];
  const query = 'SELECT * FROM schedule WHERE id = ? AND is_deleted = 0';
  connection.query(query, parameter, (error, rows) => {
    if (error) {
      response.status(500);
      response.json({
        ok: false,
        results: error.message,
      });
    } else {
      const schedule = rows.map(rowToMemory);
      response.json({
        ok: true,
        results: rows.map(rowToMemory),
      });
    }
  });
});

// get schedule for a given day
// schedule/day/:day
// day_schedule/:day
service.get('/schedule/day/:week_day', (request, response) => {
  const parameter = [request.params.week_day];
  const query = 'SELECT * FROM schedule WHERE week_day = ? AND is_deleted = 0';
  connection.query(query, parameter, (error, rows) => {
    if (error) {
      response.status(500);
      response.json({
        ok: false,
        results: error.message,
      });
    } else {
      const schedule = rows.map(rowToMemory);
      response.json({
        ok: true,
        results: rows.map(rowToMemory),
      });
    }
  });
});

// get schedule for a certain user
service.get('/schedule/user/:first_name', (request, response) => {
  const parameter = [request.params.first_name];
  const query = 'SELECT * FROM schedule WHERE first_name = ? AND is_deleted = 0';
  connection.query(query, parameter, (error, rows) => {
    if (error) {
      response.status(500);
      response.json({
        ok: false,
        results: error.message,
      });
    } else {
      const schedule = rows.map(rowToMemory);
      response.json({
        ok: true,
        results: rows.map(rowToMemory),
      });
    }
  });
});

// get schedule for a certain user and day
service.get('/schedule/:first_name/:week_day', (request, response) => {
  const parameters = [
    request.params.first_name,
    request.params.week_day
  ];
  const query = 'SELECT * FROM schedule WHERE first_name = ? AND week_day = ? AND is_deleted = 0';
  connection.query(query, parameters, (error, rows) => {
    if (error) {
      response.status(500);
      response.json({
        ok: false,
        results: error.message,
      });
    } else {
      const schedule = rows.map(rowToMemory);
      response.json({
        ok: true,
        results: rows.map(rowToMemory),
      });
    }
  });
});

// get access to report.html
service.get('/report.html', (request, response) => {
  response.sendFile('./report.html', {root: __dirname});
});

/* INSERT ENDPOINTS */

// create a new schedule entry
service.post('/schedule', (request, response) => {
  if (request.body.hasOwnProperty('first_name') &&
    request.body.hasOwnProperty('start_time') &&
    request.body.hasOwnProperty('end_time') &&
    request.body.hasOwnProperty('week_day')
    // && request.body.hasOwnProperty('is_deleted')
    ){

    const parameters = [
      request.body.first_name,
      request.body.start_time,
      request.body.end_time,
      request.body.week_day,
      // request.body.is_deleted
    ];
    const query = 'INSERT INTO schedule(first_name, start_time, end_time, week_day) VALUES (?, ?, ?, ?)';
    connection.query(query, parameters, (error, result) => {
      if (error) {
        response.status(500);
        response.json({
          ok: false,
          results: "When inserting, follow the format: {\"first_name\": \"Jane\", \"start_time\": \"8:00\", \"end_time\": \"10:45\", \"week_day\": \"Tuesday\"}",
        });
      } else {
        response.json({
          ok: true,
          results: result.insertId + " has been inserted.",
        });
      }
    });
  } else {
    response.status(400);
    response.json({
      ok: false,
      results: 'Incomplete memory.',
    });
  }
});

/* UPDATE ENDPOINTS */

// edit a specific user's schedule for a specific day
service.patch('/schedule/:id', (request, response) => {
  const parameters = [
    request.body.first_name,
    request.body.start_time,
    request.body.end_time,
    request.body.week_day,
    request.params.id
  ];

  const query = 'UPDATE schedule SET first_name = ?, start_time = ?, end_time = ?, week_day = ? WHERE id = ? AND is_deleted = 0';
  connection.query(query, parameters, (error, result) => {
    if (error) {
      response.status(404);
      response.json({
        ok: false,
        results: "Failed to update: entry not found.",
      });
    } else {
      response.json({
        ok: true,
        results: request.body.first_name + "'s schedule has been updated.",
      });
    }
  });
});

/* DELETE ENDPOINTS */

// delete schedule record
service.delete('/schedule/:id', (request, response) => {
  const parameters = [
    request.params.id
  ];

  const query = 'UPDATE schedule SET is_deleted = 1 WHERE id = ?';
  connection.query(query, parameters, (error, result) => {
    if (error) {
      response.status(404);
      response.json({
        ok: false,
        results: "Failed to delete: entry not found.",
      });
    } else {
      response.json({
        ok: true,
        result: "Schedule with id: " + request.params.id + " has been deleted.",
      });
    }
  });
});
