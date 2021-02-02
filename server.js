import express from 'express';
import cors from 'cors';
import knex from 'knex';
import bcrypt from 'bcryptjs';

import {handleRegister} from './controllers/register.js';

const db = knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: 'user',
    password: '',
    database: 'color-detector',
  },
});

db.select('*')
  .from('users')
  .then((data) => {
    console.log(data);
  });

const app = express();

app.use(express.urlencoded({extended: false})); //replaces bodyParser package, native functionality
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('success');
});

app.post('/register', (req, res) => {
  handleRegister(req, res, db, bcrypt); //dependency injection
});

app.post('/signin', (req, res) => {
  const {email, password} = req.body;
  db.select('email', 'hash')
    .from('login')
    .where('email', '~*', email)
    .then((data) => {
      const isValid = bcrypt.compareSync(password, data[0].hash);
      if (isValid) {
        return db
          .select('*')
          .from('users')
          .where('email', '~*', email)
          .then((user) => {
            res.json(user[0]);
          })
          .catch((err) => res.status(400).json('unable to get user'));
      } else {
        res.status(400).json('Invalid credentials');
      }
    })
    .catch((err) => res.status(400).json('wrong credentials'));
});

app.get('/profile/:id', (req, res) => {
  const {id} = req.params;
  db.select('*')
    .from('users')
    .where({
      id: id,
    }) //ES6 .where({id})
    .then((user) => {
      if (user.length) {
        //checks for an empty array in case of a nonexistent user id
        res.status(200).json('user found!');
        console.log(user[0]); //returns the object and not the whole array
      } else {
        res.status(404).json('user not found');
      }
    })
    .catch((err) => res.status(400).json('error finding user'));
});

app.put('/palettes', (req, res) => {
  const {email, colors} = req.body;
  db('palettes')
    .returning('*') //knex method
    .insert({
      email: email,
      colors: colors,
    })
    .then((palette) => {
      res.json(palette[0].colors); //returns the array of colors
    })
    .catch((err) => res.status(400).json('error adding palette'));
});

app.listen(3000, () => {
  console.log('app is running on port 3000');
});
