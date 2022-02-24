const totalLikes = (blogs) => {
  return blogs.reduce((total, blog) => {
    return total + blog.likes
  }, 0)
}

const favoriteBlog = (blogs) => {
  return blogs.reduce((previousFavourite, blog) => {
    if (previousFavourite) {
      return previousFavourite.likes > blog.likes ? previousFavourite : blog
    } {
      return blog
    }
  })
}

const blogsAndLikesByAuthor = (blogs) => {
  return blogs.reduce((totals, blog) => {
    if (blog.author in totals) {
      totals[blog.author].numberOfBlogs += 1
      totals[blog.author].totalLikes += blog.likes
    } else {
      totals[blog.author] = {
        author: blog.author,
        numberOfBlogs: 1,
        totalLikes: blog.likes
      }
    }
    return totals
  }, {})
}

const mostBlogs = (blogs) => {
  const blogsByAuthors = blogsAndLikesByAuthor(blogs)

  const result = Object.values(blogsByAuthors).reduce((authorWithMostBlogs, author) => {
    if (authorWithMostBlogs) {
      return authorWithMostBlogs.numberOfBlogs > author.numberOfBlogs ? authorWithMostBlogs : author
    } else {
      return author
    }
  })

  return {
    author: result.author,
    blogs: result.numberOfBlogs
  }
}

const mostLikes = (blogs) => {
  const blogsByAuthors = blogsAndLikesByAuthor(blogs)

  const result = Object.values(blogsByAuthors).reduce((authorWithMostLikes, author) => {
    if (authorWithMostLikes) {
      return authorWithMostLikes.totalLikes > author.totalLikes ? authorWithMostLikes : author
    } else {
      return author
    }
  })

  return {
    author: result.author,
    likes: result.totalLikes
  }
}

module.exports = {
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}