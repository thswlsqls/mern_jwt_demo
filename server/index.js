require('dotenv').config();

const express = require('express');
const app = express();
const chalk = require('chalk');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('./config/key');
const cors = require('cors');

//application/X-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
//application/json
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

app.use('/api/users', require('./routes/users'));
app.use('/api/posts', require('./routes/posts'));

const mongoose = require('mongoose');
mongoose
  .connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
    dbName: 'myFirstDatabase',
  })
  .then(() => console.log(chalk.blue('MongoDB connected...')))
  .catch((err) => console.log(err));

app.get('/', (req, res) => {
  res.send('Hello World! 안녕하세요!');
});

app.get('/dotenv', function (req, res, next) {
  // // DB_NAME 출력
  // res.send('안녕하세요 ~~');
  res.send(process.env);
});

app.get('/api/hello', (req, res) => {
  res.send('안녕하세요 ~');
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(chalk.blue(`Example app listening at http://localhost:${port}`));
});
