const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    const total = blogs.reduce((previous, current) => previous + current.likes, 0)

    return total
}

const favoriteBlog = (blogs) => {
    var favBlogLikes = 0
    var favBlog = {}
    
    for (var i = 0; i < blogs.length; i++) {
        let blog = blogs[i]

        if (favBlogLikes < blog.likes) {
            favBlogLikes = blog.likes
            favBlog = blog
        }
    }

    return favBlog
}

const mostBlogs = (blogs) => { 
    var mostBloggerBlogs = 0
    var mostBlogger = {}

    var blogAuthors = []

    // filter through all authors

    for (var i = 0; i < blogs.length; i++) {
        let blog = blogs[i]

        if (!blogAuthors.includes(blog.author)) {
            blogAuthors.push(blog.author)
        }
    }

    // filter through all blogs + return author with most blogs

    for (var i = 0; i < blogAuthors.length; i++) {
        let author = blogAuthors[i]
        let authorBlogs = blogs.filter(blog => blog.author == author)

        let authorBlogCount = 0

        authorBlogs.forEach(blog => authorBlogCount += 1)

        if (mostBloggerBlogs < authorBlogCount) {
            mostBlogger = authorBlogCount
            mostBlogger = author
        }
    }

    return mostBlogger
}

const mostLikes = (blogs) => {
    mostAuthorLikes = 0
    mostAuthor = {}

    var blogAuthors = []

    // filter through all authors

    for (var i = 0; i < blogs.length; i++) {
        let blog = blogs[i]

        if (!blogAuthors.includes(blog.author)) {
            blogAuthors.push(blog.author)
        }
    }

    // filter through all blogs and sum blog likes

    for (var i = 0; i < blogAuthors.length; i++) {
        let author = blogAuthors[i]
        let authorBlogLikes = 0

        let authorBlogs = blogs.filter(blog => blog.author === author)
        authorBlogs.forEach(blog => authorBlogLikes += 1)
        
        if (mostAuthorLikes < authorBlogLikes) {
            mostAuthorLikes = authorBlogLikes
            mostAuthor = author
        }
    }

    return mostAuthor
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}