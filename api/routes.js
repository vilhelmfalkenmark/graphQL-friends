const router = require('express').Router();
const dataBase = require('./database')();

router.route('/').get((req,res) => {
  res.json({ people: dataBase });
});

const findIndexOfRequestedPerson = requestedID => {
  let indexOfRequestedPerson = false;
  let i;
  for (i = 0; i < dataBase.length; i++) {
    if(dataBase[i].id == requestedID) {
      indexOfRequestedPerson = i;
    }
  }
  return indexOfRequestedPerson;
}

router.route('/:id')
  .get((req,res) => {
    const indexOfRequestedPerson = findIndexOfRequestedPerson(parseInt(req.params.id));

    if(typeof(indexOfRequestedPerson) !== 'boolean') {
      res.json({ person: dataBase[indexOfRequestedPerson]});
    } else {
      res.json({error: 'person not found'})
    }
  })
  .put((req, res) => {
    const indexOfRequestedPerson = findIndexOfRequestedPerson(parseInt(req.params.id));
    dataBase[indexOfRequestedPerson].votes++;

    if(typeof(indexOfRequestedPerson) !== 'boolean') {
      res.json({ person: dataBase[indexOfRequestedPerson]});
    } else {
      res.json({error: 'person not found'})
    }
  });



module.exports = router;
