import express from 'express';
import cors from 'cors';
import knex from 'knex';
import bcrypt from 'bcryptjs';

import {handleRegister} from './controllers/register.js';
import {handleSignin} from './controllers/signin.js';
import {handleProfileGet} from './controllers/profile.js';
import {handleApiCall, handlePalettesSave} from './controllers/palettes.js';

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

app.post('/register', handleRegister(db, bcrypt)); //dependency injection

app.post('/signin', handleSignin(db, bcrypt));

app.get('/profile/:id', handleProfileGet(db));

app.put('/palettes', handlePalettesSave(db));

app.post('/imageurl', handleApiCall());

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log('Server is listeling on port ${PORT}');
});
