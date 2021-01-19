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
      palettes: [],
      joined: new Date()
    },
    {
        id: '2',
        name: 'Alex',
        email: 'lex@gmail.com',
        password: 'bacon',
        palettes: [],
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
    res.json(database.users[database.users.length-1]); //shows the latest user registered
  })

  app.get('/profile/:id', (req, res) => {
    const { id } = req.params; 
    let found = false;
    database.users.forEach(user => {
      if (user.id === id) {
        found = true;
        return res.json(user);
      }
    })
    if (!found) {
      res.status('404').json('user not found');
    }
  })

  app.put('/palettes', (req, res) => {
    const {id, palette } = req.body
    let found = false;
    database.users.forEach(user => {
      if (user.id === id) {
        found = true;
        user.palettes.push(palette)
        return res.json(user).palettes;
      }
    })
    if (!found) {
      res.status('404').json('user not found');
    }

  })

  /* ROUTES
/ --> res = this is working OK
/signin --> POST = success/fail OK
/register --> POST = new user OK
/profile/:userId --> GET = user OK
/palettes --> PUT = updated user

*/

app.listen(3000, () => {
  console.log('app is running on port 3000');
});
