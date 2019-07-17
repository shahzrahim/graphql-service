import { GraphQLServer } from 'graphql-yoga'


//String, Boolean, Int, Float, ID
// 5 Scaler Types

//Collection Types
//


// Demo User Data
const users = [
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

const myPosts = [{
    id: "1",
    title: "Post #1",
    body: "shaz@aol.com",
    published: true,
    author: "1"
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

const myComments = [
    {
        id: "1123",
        text: "ShahzComi",
        author: "1"
    },
    {
        id: "4322",
        text: "MaryComit",
        author: "1"
    },
    {
        id: "3342",
        text: "ScottCommit",
        author: "1"
    },
    {
        id: "5123",
        text:"brobrobroooooo",
        author: "2"
    }
]


// Type definitions (schema)
const typeDefs = `
    type Query {
        users(query: String): [User!]!
        myPosts(query: String): [Post!]!
        me: User!
        posts: Post!
        comments: [Comment!]!
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
    }
    type Comment {
        id: ID!
        text: String!
        author: User!
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
        myPosts(parent, args, crx, info) {
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
    User: {
        posts(parent, args, crx, info) {
            console.log(myPosts);

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
        }
    },
    Comment: {
        author(parent, args, crx, info) {
          return users.find((user) => {
            return user.id === parent.author
          })
        }
    }

}

const server = new GraphQLServer({
    typeDefs,
    resolvers
})

server.start(() => {
    console.log('The server is up!')
})
