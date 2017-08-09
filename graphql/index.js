import { find, filter } from 'lodash';
import { makeExecutableSchema } from 'graphql-tools';
import express from 'express';
import fetch from 'node-fetch';
import graphqlHTTP from 'express-graphql';
const app = express();

const authors = [
  { id: 1, firstName: 'Tom', lastName: 'Coleman' },
  { id: 2, firstName: 'Sashko', lastName: 'Stubailo' },
  { id: 3, firstName: 'Mikhail', lastName: 'Novikov' },
];

const posts = [
  { id: 1, authorId: 1, title: 'Introduction to GraphQL', votes: 2 },
  { id: 2, authorId: 2, title: 'Welcome to Meteor', votes: 3 },
  { id: 3, authorId: 2, title: 'Advanced GraphQL', votes: 1 },
  { id: 4, authorId: 3, title: 'Launchpad is Cool', votes: 7 },
];

// When using graphql-tools, you describe the schema
// as a GraphQL type language string:

const typeDefs = `
  type Author {
    id: Int!
    firstName: String
    lastName: String
    posts: [Post] # the list of Posts by this author
  }

  type Post {
    id: Int!
    title: String
    author: Author
    votes: Int
  }

  # the schema allows the following query:
  type Query {
    posts: [Post]
    author(id: Int!): Author
  }

  # this schema allows the following mutation:
  type Mutation {
    upvotePost (
      postId: Int!
    ): Post
  }
`;

// Then you define resolvers as a nested object that maps type and
// field names to resolver functions:

const resolvers = {
  Query: {
    posts: () => posts,
    author: (_, { id }) => find(authors, { id: id }),
  },
  Mutation: {
    upvotePost: (_, { postId }) => {
      const post = find(posts, { id: postId });
      if (!post) {
        throw new Error(`Couldn't find post with id ${postId}`);
      }
      post.votes += 1;
      return post;
    },
  },
  Author: {
    posts: (author) => filter(posts, { authorId: author.id }),
  },
  Post: {
    author: (post) => find(authors, { id: post.authorId }),
  },
};

// At the end, the schema and resolvers are
// combined using makeExecutableSchema:

export const schema = makeExecutableSchema({
  typeDefs,
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

/*
query PostsForAuthor {
author(id: 1) {
  firstName
  posts {
    title
    votes
  }
}
}

query PostsForAuthor2 {
  posts {
    id,
    title,
    votes
  }
}

mutation PostsForAuthor3 {
  upvotePost(postId:2) {
    id,
    votes
  }
}
*/
