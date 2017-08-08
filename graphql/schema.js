import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList
} from 'graphql';

import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:8000';

const PersonType = GraphQLObjectType({
  name: 'Person',
  description: 'Det här är en skön PersonType',
  fields: () => {
    firstName: {
      type: GraphQLString
      resolve: (person) => person.first_name
    }
    lastName: {
      type: GraphQLString;
      resolve: (person) => person.last_name
    }
    email: {type: GraphQLString}
    username: {type: GraphQLString}
    id: {type: GraphQLString}
    friends: {
      type: new GraphQLList(PersonType)
      resolve: (person) => person.friends.map(getPersonByURL('1'))
    }
  }
})


const getPersonByURL = (relativeURL) => {
  return fetch(`${BASE_URL}/people/${relativeURL}/`)
  .then(res => res.json())
  .then(json => json.person)
}

const QueryType = new GraphQLObjectType({
  name: 'Query',
  description: '...',
  fields: () => ({
    person: {
      type: PersonType,
      args: {
        id: { type: GraphQLString }
      },
      resolve: (root, args) => getPersonByURL(`people/${args.id}`)
    }
  })
})


export default new GraphQLSchema({
  query: QueryType
})
