import express from 'express';
import bcrypt from 'bcryptjs';
import cors from 'cors';
import knex from 'knex';

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

const database = {
  users: [
    {
      id: '1',
      name: 'Iris',
      email: 'iris@gmail.com',
      password: 'burgers',
      palettes: [],
      joined: new Date(),
    },
    {
      id: '2',
      name: 'Alex',
      email: 'lex@gmail.com',
      password: 'bacon',
      palettes: [],
      joined: new Date(),
    },
  ],
};

app.get('/', (req, res) => {
  res.json(database.users);
});

app.post('/register', (req, res) => {
  const {name, email, password} = req.body;
  db('users')
    .returning('*')
    .insert({
      email: email,
      name: name,
      joined: new Date(),
    })
    .then((user) => {
      res.json(user[0]);
    })
    .catch((err) => res.status(400).json('unable to register'));
  // res.json(database.users[database.users.length - 1]); //shows the latest user registered
});

app.post('/signin', (req, res) => {
  if (
    req.body.email === database.users[0].email &&
    req.body.password === database.users[0].password
  ) {
    res.status('200').json(database.users[0]);
  } else res.status('400').json('error during sign in');
});

app.get('/profile/:id', (req, res) => {
  const {id} = req.params;
  let found = false;
  database.users.forEach((user) => {
    if (user.id === id) {
      found = true;
      return res.json(user);
    }
  });
  if (!found) {
    res.status('404').json('user not found');
  }
});

app.put('/palettes', (req, res) => {
  const {id, palette} = req.body;
  let found = false;
  database.users.forEach((user) => {
    if (user.id === id) {
      found = true;
      user.palettes.push(palette);
      return res.json(user).palettes;
    }
  });
  if (!found) {
    res.status('404').json('user not found');
  }
});

//  //BCRYPTJS
// Auto-gen a salt and hash [use for register]
// bcrypt.hash(password, 8, function(err, hash) {
// console.log(hash);
// });
// // Load hash from your password DB. [use for signin]
// bcrypt.compare("B4c0/\/", $2a$08$uBYJQnRQMAdu9FTcccEPYusCoZYiA4mSPPHN3POZgNPtonSAMC5ZS, function(err, res) {
//   res.json('first guess')
// });
// bcrypt.compare("not_bacon", $2a$08$uBYJQnRQMAdu9FTcccEPYusCoZYiA4mSPPHN3POZgNPtonSAMC5ZS, function(err, res) {
//   // res === false
// });
app.listen(3000, () => {
  console.log('app is running on port 3000');
});
