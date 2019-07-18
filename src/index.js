import { GraphQLServer } from 'graphql-yoga'
import uuidv4 from 'uuid/v4';
import db from './db'

// Resolvers
const resolvers = {
    Query: {
        users(parent, args, {db}, info) {
            return (!args.query) ? db.users : db.users.filter((user) => user.name.toLowerCase().includes(args.query.toLowerCase()))
        },
        me() {
            return {
                id: '123',
                name: "mike",
                email: "shaz@aol.com",
                age: null
            }
        },
        posts(parent, args, {db}, info) {
            if (!args.query) {
                return db.myPosts
            }
            return db.myPosts.filter((post) => {
                const titleMatch = post.title.toLowerCase().includes(args.query.toLowerCase())
                const bodyMatch = post.body.toLowerCase().includes(args.query.toLowerCase())
                return titleMatch || bodyMatch;
            })
        },
        comments(parent, args, {db}, info) {
            return db.myComments
        }
    },
    Mutation: {
        createUser(parents, args, {db}, info) {
            const emailTaken = db.users.some((user) => user.email === args.data.email)

            if(emailTaken) {
                throw new Error('Email Taken')
            }

            const user = {
                id: uuidv4(),
                ...args.data
            }

            db.users.push(user)

            return user
        },
        deleteUser(parents, args, {db}, info) {
            const userIndex = db.users.findIndex((user) => user.id === args.id)

            if (userIndex === -1) {
                throw new Error("User does not exist")
            }

            const updatedUsers = db.users.splice(userIndex, 1)

            db.myPosts = db.myPosts.filter((post) => {
                const match = post.author === args.id

                if(!match) {
                    db.myComments = db.myComments.filter((comment) => comment.post !== db.post.id)
                }

                return !match
            })

            db.myComments = db.myComments.filter((comment) => comment.author !== args.id)
            return updatedUsers[0]
        },
        createPost(parents, args, {db}, info) {
            const userExists = db.users.some((user) => user.id === args.data.author)

            if(!userExists) {
                throw new Error("User not found")
            }
            const post = {
                id: uuidv4(),
                ...args.data
            }

            db.myPosts.push(post)

            return post
        },
        deletePost(parents, args, {db}, info) {
            const postExists = db.myPosts.some((post) =>  post.id === args.id)
            const postIndex = db.myPosts.findIndex((post) => post.id === args.id)


            if(!postExists) {
                throw new Error('Post does not exist')
            }



            const deletedPost = db.myPosts.splice(postIndex, 1)

            db.myComments = db.myComments.filter((comment) => {
                return comment.postId !== args.id
            })

            return deletedPost[0];
        },
        createComment(parents, args, {db}, info) {

            const userExists = db.users.some((user) => user.id === args.data.author)
            const postExists = db.myPosts.some((post) => post.id === args.data.post && post.published)

            if (!userExists || !postExists) {
              throw new Error('Unable to find user and post')
            }

            const comment = {
                id: uuidv4(),
                ...args.data
            }

            db.myComments.push(comment);

            return comment
        },
        deleteComment(parents, args, {db}, info) {
            const commentExists = db.myComments.some((comment) => comment.id === args.id)
            const commentIndex = db.myComments.findIndex((comment) => comment.id === args.id)

            if (!commentExists) {
                throw new Error('Unable to find comment')
            }
            const deletedComment = db.myComments.splice(commentIndex, 1)


            return deletedComment[0];

        }
    },
    User: {
        posts(parent, args, {db}, info) {
            return db.myPosts.filter((post) =>{
                return post.author === parent.id
            })
        },
        comments(parent, args, {db}, info) {
            return db.myComments.filter((comment) => {
                return comment.author === parent.id
            })
        }
    },
    Post: {
        author(parent, args, {db}, info) {
            return db.users.find((user) => {
                return db.user.id === parent.author
            })
        },
        comments(parent, args, {db}, info) {
            return db.myComments.filter((comment) => {
                return comment.postId === parent.id
            })
        }
    },
    Comment: {
        author(parent, args, {db}, info) {
          return db.users.find((user) => {
            return user.id === parent.author
          })
        },
        post(parent, args, {db}, info) {

          return db.myPosts.find((post) => {
            return post.id  === parent.postId
          })
        },
    }

}

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers,
    context: {
        db
    }
})

server.start(() => {
    console.log('The server is up!')
})
