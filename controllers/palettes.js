import Clarifai from 'clarifai';

const app = new Clarifai.App({
  apiKey: '392df143705b437c8bc35ad3e248ad06',
});

const handleApiCall = () => (req, res) => {
  app.models
    .predict(Clarifai.COLOR_MODEL, req.body.input)
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.status(400).json('Error detecting colors');
    });
};

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
export {handleApiCall};
