const router = require('express').Router();
const dataBase = require('./database')();
// /people
router.get('/', function(req, res) {
  res.json({ people: dataBase });
});

// /people/:id
router.get('/:id', function(req, res) {
  const requestedID = parseInt(req.params.id);
  const requestedPerson = dataBase.filter(person => person.id === requestedID)[0];
  if(requestedPerson) {
    res.json({ person: requestedPerson });
  } else {
    res.json({error: 'person not found'})
  }
});

module.exports = router;
