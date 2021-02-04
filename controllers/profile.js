const handleProfileGet = (db) => (req, res) => {
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
};

export {handleProfileGet};
