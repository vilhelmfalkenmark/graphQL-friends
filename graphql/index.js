import { find, filter } from 'lodash';
import { makeExecutableSchema } from 'graphql-tools';
import express from 'express';
import axios from 'axios';
import graphqlHTTP from 'express-graphql';
import graphql from 'graphql';
import fetch from 'node-fetch';
const app = express();
// import typeDefs from "./schema.graphql";

const BASE_URL = 'http://localhost:8000/people';

const test = [
  {
    id: 1,
    personId: 1,
    fact: 'Tillhör person 1'
  },
  {
    id: 2,
    personId: 2,
    fact: 'Tillhör person 2'
  },
  {
    id: 3,
    personId: 3,
    fact: 'Tillhör person 3'
  },
  {
    id: 4,
    personId: 4,
    fact: 'Tillhör person 4'
  }
]

const people = {
  findByID: (id = 1) => {
    return axios.get(`${BASE_URL}/${id}`)
    .then((response) => {
      return response.data.person;
      })
    .catch((error) => {
      return error
    });
  },
  findAll: () => {
    return axios.get(`${BASE_URL}`)
    .then((response) => {
      return response.data.people;
      })
    .catch((error) => {
      return error
    });
  },
  findFriends: (friendArray = []) => {
    const promiseArray = friendArray.map(friendId => axios.get(`${BASE_URL}/${friendId}`));
    return axios.all(promiseArray).then((results) => {
      const friendsResponseArray = results.map(response => response.data).map(person => person.person);
      return friendsResponseArray;
    }).catch((error) => {
      return error
    })
  },
  upvotePerson: (id) => {
    return axios.put(`${BASE_URL}/${id}`)
    .then(response => response.data.person)
    .catch(error => error)
  }
}
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
    last_name: String
  }

  type Person {
    id: Int!
    first_name: String,
    last_name: String,
    stuff: [Stuff] # The stuff belonging to this person,
    friends: [Person],
    full_name: String,
    votes: Int
  }

  type Stuff {
    id: Int!
    fact: String
  }

  # the schema allows the following query:
  type Query {
    person(id: Int!): Person
    people: [People]
    hello: String
  }

  type Mutation {
    upvotePerson(id: Int!): Person
  }
`;
/*
Then you define resolvers as a nested object that maps type and
field names to resolver functions
*/
const resolvers = {
  Query: {
    person: (context, {id}) => people.findByID(id),
    people: () => people.findAll()
  },
  Mutation: {
    upvotePerson: (context, {id}) => {
      return people.upvotePerson(id);
    }
  },
  Person: {
    stuff: person => test.filter(thing => thing.personId === person.id),
    friends: person => people.findFriends(person.friends),
    full_name: person => `${person.first_name} ${person.last_name}`
  }
}
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
