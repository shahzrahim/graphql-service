import { GraphQLServer } from 'graphql-yoga'
import uuidv4 from 'uuid/v4';

//String, Boolean, Int, Float, ID
// 5 Scaler Types

//Collection Types
//


// Demo User Data
let users = [
    {
        id: "1",
        name: "Shahzi",
        email: "shaz@aol.com",
        comments: ["1123", "4322", "3342"]
    },
    {
        id: "2",
        name: "Mary",
        email: "Mary@aol.com",
        age: 24,
        comments:[],
    },
    {
        id: "3",
        name: "Scott",
        email: "Scotry@aol.com",
        age: 24,
        comments: ["5123"]
    }
]

let myPosts = [{
    id: "1",
    title: "Post #1",
    body: "shaz@aol.com",
    published: true,
    author: "1",
  },
  {
    id: "2",
    title: "Post #2",
    body: "body of post 2",
    published: true,
    author: "1"
  },
  {
    id: "3",
    title: "Post #3",
    body: "body of post 3",
    published: false,
    author: "3"
  }
]

let myComments = [
    {
        id: "1123",
        text: "ShahzComi",
        author: "1",
        postId:"1"
    },
    {
        id: "4322",
        text: "MaryComit",
        author: "1",
        postId:"2"
    },
    {
        id: "3342",
        text: "ScottCommit",
        author: "1",
        postId:"1"
    },
    {
        id: "5123",
        text:"brobrobroooooo",
        author: "2",
        postId:"3"
    }
]


// Type definitions (schema)
const typeDefs = `
    type Query {
        users(query: String): [User!]!
        posts(query: String): [Post!]!
        me: User!
        post: Post!
        comments: [Comment!]!
    }
    type Mutation {
        createUser(data: CreateUserInput!): User!
        deleteUser(id: ID!): User!
        createPost(data: CreatePostInput!): Post!
        createComment(data: CreateCommentInput!): Comment!
    }

    input CreateUserInput {
        name: String!
        email: String!
        age: Int
    }

    input CreatePostInput {
        title: String!
        body: String!
        published: Boolean!
        author: ID!
    }

    input CreateCommentInput {
        text: String!
        author: ID!
        post: ID!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
        posts: [Post!]!
        comments: [Comment!]!
    }
    type Post {
        id: ID!
        title: String!
        body: String!
        published: String
        author: User!
        comments: [Comment!]
    }
    type Comment {
        id: ID!
        text: String!
        author: User!
        post: Post!
    }

`

// Resolvers
const resolvers = {
    Query: {
        users(parent, args, crx, info) {
            return (!args.query) ? users : users.filter((user) => user.name.toLowerCase().includes(args.query.toLowerCase()))
        },
        me() {
            return {
                id: '123',
                name: "mike",
                email: "shaz@aol.com",
                age: null
            }
        },
        posts(parent, args, crx, info) {
            if (!args.query) {
                return myPosts
            }
            return myPosts.filter((post) => {
                const titleMatch = post.title.toLowerCase().includes(args.query.toLowerCase())
                const bodyMatch = post.body.toLowerCase().includes(args.query.toLowerCase())
                return titleMatch || bodyMatch;
            })
        },
        comments(parent, args, crx, info) {
            return myComments
        }
    },
    Mutation: {
        createUser(parents, args, crx, info) {
            const emailTaken = users.some((user) => user.email === args.data.email)

            if(emailTaken) {
                throw new Error('Email Taken')
            }

            const user = {
                id: uuidv4(),
                ...args.data
            }

            users.push(user)

            return user
        },
        deleteUser(parents, args, ctx, info) {
            const userIndex = users.findIndex((user) => user.id === args.id)

            if (userIndex === -1) {
                throw new Error("User does not exist")
            }

            const updatedUsers = users.splice(userIndex, 1)

            myPosts = myPosts.filter((post) => {
                const match = post.author === args.id

                if(!match) {
                    myComments = myComments.filter((comment) => comment.post !== post.id)
                }

                return !match
            })

            myComments = myComments.filter((comment) => comment.author !== args.id)
            return updatedUsers[0]
        },
        createPost(parents, args, ctx, info) {
            const userExists = users.some((user) => user.id === args.data.author)

            if(!userExists) {
                throw new Error("User not found")
            }
            const post = {
                id: uuidv4(),
                ...args.data
            }

            myPosts.push(post)

            return post
        },
        createComment(parents, args, ctx, info) {
            console.log(...args);

            const userExists = users.some((user) => user.id === args.data.author)
            const postExists = myPosts.some((post) => post.id === args.data.post && post.published)

            if (!userExists || !postExists) {
              throw new Error('Unable to find user and post')
            }

            const comment = {
                id: uuidv4(),
                ...args.data
            }

            myComments.push(comment);

            return comment
        }
    },
    User: {
        posts(parent, args, crx, info) {
            return myPosts.filter((post) =>{
                return post.author === parent.id
            })
        },
        comments(parent, args, crx, info) {
            return myComments.filter((comment) => {
                return comment.author === parent.id
            })
        }
    },
    Post: {
        author(parent, args, crx, info) {
            return users.find((user) => {
                return user.id === parent.author
            })
        },
        comments(parent, args, crx, info) {
            return myComments.filter((comment) => {
                return comment.postId === parent.id
            })
        }
    },
    Comment: {
        author(parent, args, crx, info) {
          return users.find((user) => {
            return user.id === parent.author
          })
        },
        post(parent, args, crx, info) {

          return myPosts.find((post) => {
            return post.id  === parent.postId
          })
        },
    }

}

const server = new GraphQLServer({
    typeDefs,
    resolvers
})

server.start(() => {
    console.log('The server is up!')
})
