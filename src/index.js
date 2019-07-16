import { GraphQLServer } from 'graphql-yoga'


//String, Boolean, Int, Float, ID
// 5 Scaler Types

//Collection Types
//


// Demo User Data
const users = [{
    id: "1",
    name: "Shahzi",
    email: "shaz@aol.com",
},
{
  id: "2",
  name: "Mary",
  email: "Mary@aol.com",
  age: 24,
},
{
  id: "3",
  name: "Scott",
  email: "Scotry@aol.com",
  age: 24,
}
]


// Type definitions (schema)
const typeDefs = `
    type Query {
        users(query: String): [User!]!
        me: User!
        posts: Post!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        published: String
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
        posts() {
            return {
                id: "as32423123124123",
                title:"The day I finished my post",
                body:"leps  sxfsdfsdfs  sdfsdf",
            }
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
