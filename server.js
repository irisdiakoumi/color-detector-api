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
  const hash = bcrypt.hashSync(password, 10);
  db.transaction((trx) => {
    //tranasctions in knex
    trx
      .insert({
        hash: hash,
        email: email,
      })
      .into('login')
      .returning('email')
      .then((loginEmail) => {
        return trx('users')
          .returning('*') //knex method
          .insert({
            email: loginEmail[0],
            name: name,
            joined: new Date(),
          })
          .then((user) => {
            res.json(user[0]);
          });
      })
      .then(trx.commit) //VERY important to actually commit the additions and rollback in case anything fails
      .catch(trx.rollback);
  }).catch((err) => res.status(400).json('unable to register'));
  // res.json(database.users[database.users.length - 1]); //shows the latest user registered
});

app.post('/signin', (req, res) => {
  db.select('email', 'hash')
    .from('login')
    .then((data) => {
      const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
      console.log(isValid);
      if (isValid) {
        return db
          .select('*')
          .from('users')
          .where('email', '=', req.body.email)
          .then((user) => {
            res.json(user[0]);
          })
          .catch((err) => res.status(400).json('unable to get user'));
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

  // let found = false;
  // database.users.forEach((user) => {
  //   if (user.id === id) {
  //     found = true;
  //     user.palettes.push(palette);
  //     return res.json(user).palettes;
  //   }
  // });
  // if (!found) {
  //   res.status('404').json('user not found');
  // }
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
