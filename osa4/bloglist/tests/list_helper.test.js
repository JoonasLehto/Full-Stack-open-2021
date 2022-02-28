const listHelper = require('../utils/list_helper')

const listWithOneBlog = [
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  }
]

const listWithMultipleBlogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0
  }  
]

describe('total likes', () => {
  const expectedNumberOfLikesForSingleBlog = 5
  const expectedNumberOfLikesForMultipleBlogs = 36

  test('when list has only one blog equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    expect(result).toBe(expectedNumberOfLikesForSingleBlog)
  })

  test('when list has multiple blogs equals the sum of all likes', () => {
    const result = listHelper.totalLikes(listWithMultipleBlogs)
    expect(result).toBe(expectedNumberOfLikesForMultipleBlogs)
  })
})

describe('favourite blog', () => {
  const expectedFavouriteBlogForSingleBlog = listWithOneBlog[0]
  const expectedFavouriteBlogForMultipleBlogs = listWithMultipleBlogs[2]

  test('when list has only one blog returns the first blog', () => {
    const result = listHelper.favoriteBlog(listWithOneBlog)
    expect(result).toEqual(expectedFavouriteBlogForSingleBlog)
  })
  
  test('when list has multiple blogs returns the blog with most likes', () => {
    const result = listHelper.favoriteBlog(listWithMultipleBlogs)
    expect(result).toEqual(expectedFavouriteBlogForMultipleBlogs)
  })
})

describe('most blogs', () => {
  const expectedAuthorForSingleBlog = {
    author: 'Edsger W. Dijkstra',
    blogs: 1
  }
  const expectedAuthorForMultipleBlogs = {
    author: "Robert C. Martin",
    blogs: 3
  }

  test('when list has only one blog returns the author of the first blog', () => {
    const result = listHelper.mostBlogs(listWithOneBlog)
    expect(result).toEqual(expectedAuthorForSingleBlog)
  })

  test('when list has only multiple blogs returns the author with most blogs', () => {
    const result = listHelper.mostBlogs(listWithMultipleBlogs)
    expect(result).toEqual(expectedAuthorForMultipleBlogs)
  })
})

describe('most likes', () => {
  const expectedAuthorForSingleBlog = {
    author: 'Edsger W. Dijkstra',
    likes: 5
  }
  const expectedAuthorForMultipleBlogs = {
    author: 'Edsger W. Dijkstra',
    likes: 17
  }

  test('when list has only one blog returns the author of the first blog', () => {
    const result = listHelper.mostLikes(listWithOneBlog)
    expect(result).toEqual(expectedAuthorForSingleBlog)
  })

  test('when list has only multiple blogs returns the author with most blogs', () => {
    const result = listHelper.mostLikes(listWithMultipleBlogs)
    expect(result).toEqual(expectedAuthorForMultipleBlogs)
  })
})