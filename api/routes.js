const router = require('express').Router();
const dataBase = require('./database')();
// /people
router.get('/', function(req, res) {
  res.json({ people: dataBase });
});

// /people/:id
router.get('/:id', function(req, res) {
  console.log(dataBase);
  res.json({ people: dataBase.filter(person => person.id === req.params.id) });
});

module.exports = router;
