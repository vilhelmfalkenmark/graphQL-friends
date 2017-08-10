const router = require('express').Router();
const dataBase = require('./database')();

////////////////////////////////////////////////
// GET ALLPEOPLE
///////////////////////////////////////////////
router.route('/').get((req, res) => {
  res.json({people: dataBase});
});

////////////////////////////////////////////////
// GET SPECIFIC PERSON AND UPDATE VOTES
// THROUGH PUT METHOD AND
// ADD FRIENDS THROUGH POST METHOD
///////////////////////////////////////////////
const findIndexOfRequestedPerson = requestedID => {
  let indexOfRequestedPerson = false;
  let i;
  for (i = 0; i < dataBase.length; i++) {
    if (dataBase[i].id == requestedID) {
      indexOfRequestedPerson = i;
    }
  }
  return indexOfRequestedPerson;
}

router.route('/:id')
.get((req, res) => {
  const indexOfRequestedPerson = findIndexOfRequestedPerson(parseInt(req.params.id));

  if (typeof(indexOfRequestedPerson) !== 'boolean') {
    res.json({person: dataBase[indexOfRequestedPerson]});
  } else {
    res.json({error: 'person not found'})
  }
})
.put((req, res) => {
  const indexOfRequestedPerson = findIndexOfRequestedPerson(parseInt(req.params.id));

  dataBase[indexOfRequestedPerson].votes++;

  if (typeof(indexOfRequestedPerson) !== 'boolean') {
    res.json({person: dataBase[indexOfRequestedPerson]});
  } else {
    res.json({error: 'person not found'})
  }
})
.post((req, res) => {
  const {id, friendId} = req.body;

  const indexOfRequestedPerson = findIndexOfRequestedPerson(parseInt(id));
  const indexOfRequestedFriend = findIndexOfRequestedPerson(parseInt(friendId));

  if (
    dataBase[indexOfRequestedPerson].friends.indexOf(parseInt(friendId)) === -1 &&
    dataBase[indexOfRequestedFriend].friends.indexOf(parseInt(id)) === -1 &&
    id !== friendId
    ) {
    dataBase[indexOfRequestedPerson].friends.push(parseInt(friendId));
    dataBase[indexOfRequestedFriend].friends.push(parseInt(id));
  }

  if (typeof(indexOfRequestedPerson) !== 'boolean') {
    res.json({person: dataBase[indexOfRequestedPerson]});
  } else {
    res.json({error: 'person not found'})
  }
});

module.exports = router;
