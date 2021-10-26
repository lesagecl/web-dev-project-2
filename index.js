const express = require('express');
const service = express();

const port = 5001;
service.listen(port, () => {
    console.log(`We're live on port ${port}!`);
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
    start_time: row.start_time,
    end_time: row.end_time,
    week_day: row.week_day
  };
}

// TODO: issue queries
const selectQuery = 'SELECT * FROM schedule';
connection.query(selectQuery, (error, rows) => {
  if (error) {
    console.error(error);
  } else {
    const schedules = rows.map(rowToMemory);
    console.log(schedules);
  }
});

// TODO: define endpoints
// CRUD: create, read, update, delete
// update: PATCH

// schedule for a given day
service.get('/schedule/:week_day', (request, response) => {
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
      const schedules = rows.map(rowToMemory);
      response.json({
        ok: true,
        results: rows.map(rowToMemory),
      });
    }
  });
});

// schedule for a certain id
service.get('/schedule/:id', (request, response) => {
  const parameter = [parseInt(request.params.id)];
  const query = 'SELECT * FROM schedule WHERE id = ? AND is_deleted = 0';
  connection.query(query, parameter, (error, rows) => {
    if (error) {
      response.status(500);
      response.json({
        ok: false,
        results: error.message,
      });
    } else {
      const schedules = rows.map(rowToMemory);
      response.json({
        ok: true,
        results: rows.map(rowToMemory),
      });
    }
  });
});

// schedule for a certain id and day
service.get('/schedule/:id/:week_day', (request, response) => {
  const parameters = [
    parseInt(request.params.id),
    request.params.week_day
  ];
  const query = 'SELECT * FROM schedule WHERE id = ? AND week_day = ? AND is_deleted = 0';
  connection.query(query, parameters, (error, rows) => {
    if (error) {
      response.status(500);
      response.json({
        ok: false,
        results: error.message,
      });
    } else {
      const schedules = rows.map(rowToMemory);
      response.json({
        ok: true,
        results: rows.map(rowToMemory),
      });
    }
  });
});

service.post('/schedules', (request, response) => {
    // issue insert statement...
});

// for access to report.html
service.get('/report.html', (request, response) => {
  res.sendFile('report.html', options, function (err) {
    if (err) {
        next(err);
    } else {
        console.log('Sent:', fileName);
    }
  });
});

// connection.end();
