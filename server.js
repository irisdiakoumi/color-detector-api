import express from 'express';

const app = express();

app.use(express.urlencoded({extended: false}));  //replaces bodyParser package, native functionality
app.use(express.json());  

const database = {
  users : [
    {
      id: '1',
      name: 'Iris',
      email: 'iris@gmail.com',
      password: 'burgers',
      palettes: 'palettesArray',
      joined: new Date()
    },
    {
        id: '2',
        name: 'Alex',
        email: 'lex@gmail.com',
        password: 'bacon',
        palettes: 'palettesArray2',
        joined: new Date()
    }
  ]
}

app.get('/', (req, res) => {
  res.json('the server is listening')
} )

app.post('/signin', (req, res) => {
  if(req.body.email === database.users[0].email &&
    req.body.password === database.users[0].password) {
      res.json('success');
    } else res.status('400').json('error during sign in');
  })

  app.post('/register', (req, res) => {
    const { name, email, password} = req.body;
    database.users.push(
      {
        id: '3',
        name: name,
        email: email,
        password: password,
        palettes: 'palettesArray',
        joined: new Date()
      }
    )
    res.json(database.users[database.users.length-1]);
  })
/* ROUTES
/ --> res = this is working
/signin --> POST = success/fail
/register --> POST = new user
/profile/:userId --> GET = user
/palettes --> PUT = updated user

*/

app.listen(3000, () => {
  console.log('app is running on port 3000');
});
