const handlePalettesSave = (db) => (req, res) => {
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
};

export {handlePalettesSave};
