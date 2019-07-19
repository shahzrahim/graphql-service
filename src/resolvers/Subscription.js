const Subscription = {
    comment : {
        subscribe(parent, { postId }, { db, pubsub }, info) {
            const post = db.posts.find((post) => post.id === postId && post.published)
            if(!post) {
                throw new Error("There is no such post")
            }

            return pubsub.asyncIterator(`comment ${postId}`)
        }

    },
    post : {
        subscribe(parents, args, { db, pubsub }, info) {
            return pubsub.asyncIterator(`post`)
        }
    }
}

export { Subscription as default }
