import { find, filter } from 'lodash';
import { makeExecutableSchema } from 'graphql-tools';
import express from 'express';
import axios from 'axios';
import graphqlHTTP from 'express-graphql';
import graphql from 'graphql';
const app = express();

const BASE_URL = 'http://localhost:8000/people';

const people = {
  findByID: (id = 1) => {
    return axios
      .get(`${BASE_URL}/${id}`)
      .then(response => {
        return response.data.person;
      })
      .catch(error => {
        return error;
      });
  },
  findAll: () => {
    return axios
      .get(`${BASE_URL}`)
      .then(response => {
        return response.data.people;
      })
      .catch(error => {
        return error;
      });
  },
  findFriends: (friendArray = []) => {
    const promiseArray = friendArray.map(friendId =>
      axios.get(`${BASE_URL}/${friendId}`)
    );
    return axios
      .all(promiseArray)
      .then(results => {
        const friendsResponseArray = results
          .map(response => response.data)
          .map(person => person.person);
        return friendsResponseArray;
      })
      .catch(error => {
        return error;
      });
  },
  upvotePerson: id => {
    return axios
      .put(`${BASE_URL}/${id}`)
      .then(response => response.data.person)
      .catch(error => error);
  },
  addFriend: (id, friendId) => {
    return axios
      .post(`${BASE_URL}/${id}`, {
        id,
        friendId
      })
      .then(response => response.data.person)
      .catch(error => error);
  },
  addInterest: (id, interest) => {
    return axios.patch(`${BASE_URL}/${id}`, {
      id,
      interest
    }).then(response => response.data.person)
      .catch(err => console.error(error))
    ;
  }
};
/*
1. Connector: Den som skapar en connection mot single-source-of truth
(exempelvis api, databas, fil etc.)
2. Model: Kräver en connector. Representerar en entitetstyp och hur den ska interageras med. Man kan köra
queries och mutations mot modellen.
3. Resolvers: Utgår från en modell och tar emot graphql kommandon och returnerar modelldata.
*/

// When using graphql-tools, you describe the schema
// as a GraphQL type language string:
const typeDefs = `
  type People {
    id: Int!
    first_name: String,
    last_name: String,
    full_name: String,
    friends: [Person]
  }

  type Person {
    id: Int!
    first_name: String,
    last_name: String,
    stuff: [Stuff] # The stuff belonging to this person,
    friends: [Person],
    full_name: String,
    votes: Int,
    interest: [String]
  }

  type Stuff {
    id: Int!
    fact: String
  }

  input friendId {
    id: Int!
  }

  # the schema allows the following query:
  type Query {
    person(params: friendId): Person
    people: [People]
    hello: String
  }

  type Mutation {
    upvotePerson(params: friendId): Person
    addFriend(id: Int!, friendId: Int!): Person
    addInterest(id: Int!, interest: String!): Person
  }
`;
/*
Then you define resolvers as a nested object that maps type and
field names to resolver functions
*/
const resolvers = {
  Query: {
    person: (context, { id }) => people.findByID(id),
    people: () => people.findAll()
  },
  Mutation: {
    upvotePerson: (context, { id }) => {
      return people.upvotePerson(id);
    },
    addFriend: (context, { id, friendId }) => people.addFriend(id, friendId),
    addInterest: (context, { id, interest}) => people.addInterest(id, interest)
  },
  Person: {
    stuff: person => test.filter(thing => thing.personId === person.id),
    friends: person => people.findFriends(person.friends),
    full_name: person => `${person.first_name} ${person.last_name}`
  },
  People: {
    full_name: person => `${person.first_name} ${person.last_name}`
  }
};
// At the end, the schema and resolvers are
// combined using makeExecutableSchema:
export const schema = makeExecutableSchema({
  typeDefs: [typeDefs],
  resolvers,
});

app.use(graphqlHTTP(req => {
  return {
    graphiql: true,
    schema,
  };
}));

const port = 5000;

app.listen(
  5000,
  () => console.log(`GraphQL bor på http://localhost:${port}`)
);
