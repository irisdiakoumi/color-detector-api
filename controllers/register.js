const handleRegister = (db, bcrypt) => (req, res) => {
  const {name, email, password} = req.body;
  if (!email || !name || !password) {
    res.status(400).json('incorrect form submission');
  }
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
};

export {handleRegister};
