// const process = require('process');
const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;


const connection = mysql.createConnection({
  host: 'localhost',
  user: 'sofa',
  password: '0000',
  database: 'ToDoList',
  port: '/tmp/mysql.sock',
});

// connection.connect();
connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
 
  console.log('connected as id ' + connection.threadId);
});

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/items', (req, res) => {
  connection.query('SELECT * FROM ListItems;', (err, data) => {
    if (err) throw err;
    res.json(data);
  });
});


app.delete('/items', (req, res) => {
  const { id } = req.body;
  
  connection.query(`DELETE FROM ListItems WHERE id = "${id}";`, (err) => {
    connection.query('SELECT * FROM ListItems;', (err, data) => {
      res.json(data);
    });
  })
});

app.patch('/items', (req, res) => {
  const { id, isChecked, name } = req.body;
  let queryString = '';

  if (isChecked !== undefined) {
    queryString = `UPDATE ListItems SET isChecked = "${Number(isChecked)}" WHERE id = "${id}";`
  }

  if (name !== undefined) {
    queryString = `UPDATE ListItems SET name = "${name}" WHERE id = "${id}";`
  }

  connection.query(queryString, (err) => {
    if (err) throw err;
    connection.query('SELECT * FROM ListItems;', (err, data) => {
      if (err) throw err;
      res.json(data);
    });
  });
});

app.post('/items', (req, res) => {
  const { name, isChecked } = req.body;
  console.log(name, isChecked);


  connection.query(`INSERT INTO ListItems (name, isChecked) VALUES ("${name}", ${Number(isChecked)});`, (err) => {
    if (err) throw err;
    connection.query('SELECT * FROM ListItems;', (err, data) => {
      if (err) throw err;
      res.json(data);
    });
  });

  // res.sendStatus(200);
});

// connection.end();

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// process.on('exit', () => {
//   console.log('qweqweqwe');
//   connection.end();
// });

// process.on('SIGINT', () => {
//   console.log('123123123');
//   connection.end();
// });