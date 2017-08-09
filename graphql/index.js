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
    // console.log(friendArray);
    const promiseArray = friendArray.map(friendId => axios.get(`${BASE_URL}/${friendId}`));
    console.log(promiseArray, 'promiseArray');
    return axios.all(promiseArray).then((results) => {
      let temp = results.map(response => response.data);
      console.log(temp,' temp');
      console.log(response);
      // console.log(response[0].data, ' response från promiseArray');
      // console.log(response.data, ' response från promiseArray');
      return response.data
    }).catch((error) => {
      return error
    })


    return [
      {
        first_name: "Ville",
        last_name: "Falkenmark",
        age: 31,
        id: 1,
      }
    ]
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
    friends: [Friend]
  }

  type Stuff {
    id: Int!
    fact: String
  }

  type Friend {
    id: Int!
    first_name: String,
    last_name: String
  }

  # the schema allows the following query:
  type Query {
    person(id: Int!): Person
    people: [People]
    hello: String
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
  Person: {
    stuff: (person) => {
      return test.filter(thing => thing.personId === person.id);
    },
    friends: (person) => {
      return people.findFriends(person.friends)
    }
  }
}
  // Mutation: {
  //   upvotePost: (_, { postId }) => {
  //     const post = find(posts, { id: postId });
  //     if (!post) {
  //       throw new Error(`Couldn't find post with id ${postId}`);
  //     }
  //     post.votes += 1;
  //     return post;
  //   },
  // },
  // Author: {
  //   posts: (author) => filter(posts, { authorId: author.id }),
  //   randomFact: () => 'Det här är en författare'
  // },
  // Post: {
  //   author: (post) => find(authors, { id: post.authorId }),
  // },
// };

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

app.listen(
  5000,
  () => console.log('GraphQL Server running at http://localhost:5000')
);
