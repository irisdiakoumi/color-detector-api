import express from 'express';

const app = express();

app.get('/', (req, res) => {
  res.send("this is working")
} )

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
