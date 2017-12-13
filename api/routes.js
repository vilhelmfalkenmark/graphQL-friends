const dataBase = require('./database')();
const router = require('express').Router();

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
.patch((req, res) => {
  const indexOfRequestedPerson = findIndexOfRequestedPerson(parseInt(req.params.id));
  console.log(dataBase[indexOfRequestedPerson]);
  let i;
  for (i = 0; i < dataBase.length; i += 1) {
    if(dataBase[i].id === parseInt(req.params.id,10)) {
      if(dataBase[i].interest) {
        dataBase[i].interest.push(req.body.interest);
      } else {
        dataBase[i].interest = [req.body.interest];
      }
    }
  }

  if (typeof indexOfRequestedPerson !== "boolean") {
    res.json({ person: dataBase[indexOfRequestedPerson] });
  } else {
    res.json({ error: "person not found" });
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
