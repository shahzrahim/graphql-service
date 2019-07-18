import { GraphQLServer } from 'graphql-yoga'
import uuidv4 from 'uuid/v4'
import db from './db'
import Query from './resolvers/Query';
import Mutation from './resolvers/Mutation';
import Post from './resolvers/Post';
import User from './resolvers/User';
import Comment from './resolvers/Comment';

//Bootstrap application
// Resolvers
const resolvers = {
    Query,
    Mutation,
    Post,
    User,
    Comment
}

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers: {
      Query,
      Mutation,
      Post,
      User,
      Comment
    },
    context: {
        db
    }
})

server.start(() => {
    console.log('The server is up!')
})
