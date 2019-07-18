const users = [{
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
    comments: [],
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

const myComments = [{
    id: "1123",
    text: "ShahzComi",
    author: "1",
    postId: "1"
  },
  {
    id: "4322",
    text: "MaryComit",
    author: "1",
    postId: "2"
  },
  {
    id: "3342",
    text: "ScottCommit",
    author: "1",
    postId: "1"
  },
  {
    id: "5123",
    text: "brobrobroooooo",
    author: "2",
    postId: "3"
  }
]
export default db = {
  users,
  posts,
  comments
}
