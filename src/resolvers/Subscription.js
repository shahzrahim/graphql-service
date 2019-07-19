const Subscription = {
    count: {
        subscribe(parent, args, { pubsub }, info) {
            let count = 0

            setInterval(() => {
                count++
                pubsub.publish('count', {
                    count
                })
            }, 1000)

            return pubsub.asyncIterator('count')
        }
    },
    comment : {
        subscribe(parent, { postId }, { db, pubsub }, info) {
            console.log(db.posts);
            console.log(postId);


            const post = db.posts.find((post) => post.id === postId && post.published)

            // console.log(post);

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
